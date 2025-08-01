// File: app/api/questions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/session';
import { getMatchingFilters } from '@/app/utils/searchUtils';
import { censorTextAll } from '@/app/utils/contentModeration';
import crypto from 'crypto';

// Force Node.js runtime to avoid Edge Runtime issues with crypto module
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Get the session token from cookies
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const sessionData = await validateSession(token);
    if (!sessionData) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const { text, category, district } = await request.json();
    if (!text || !category || !district) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Apply content moderation before saving
    const censoredText = censorTextAll(text);

    const question = await prisma.questions.create({
      data: {
        id: crypto.randomUUID(),
        text: censoredText, // Save censored text to database
        category,
        district,
        authorId: sessionData.userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if prisma is properly initialized
    if (!prisma) {
      console.error('Prisma client is not initialized');
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const mine = request.nextUrl.searchParams.get('mine');
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const category = request.nextUrl.searchParams.get('category');
    const district = request.nextUrl.searchParams.get('district');
    const search = request.nextUrl.searchParams.get('search');
    const showNewOnly = request.nextUrl.searchParams.get('new') === 'true';
    const showPopularOnly = request.nextUrl.searchParams.get('popular') === 'true';
    
    let userId: string | undefined = undefined;
    if (mine) {
      const token = request.cookies.get('session-token')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      const sessionData = await validateSession(token);
      if (!sessionData) {
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
      }
      userId = sessionData.userId;
    }

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (mine && userId) {
      whereClause.authorId = userId;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (district) {
      whereClause.district = district;
    }
    
    if (search) {
      // Get matching categories and districts from all languages
      const matchingFilters = getMatchingFilters(search);
      
      // Omitted: Complex search logic with OR conditions for multilingual matching
      whereClause.OR = [
        { text: { contains: search, mode: 'insensitive' } },
        { category: { in: matchingFilters.categories } },
        { district: { in: matchingFilters.districts } }
      ];
    }
    
    // Omitted: Additional filtering logic for new/popular questions
    // Omitted: Complex pagination and sorting logic

    const questions = await prisma.questions.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            username: true,
            name: true,
            surname: true
          }
        },
        answers: {
          select: {
            id: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const totalQuestions = await prisma.questions.count({ where: whereClause });
    const totalPages = Math.ceil(totalQuestions / limit);

    return NextResponse.json({
      questions,
      totalQuestions,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}