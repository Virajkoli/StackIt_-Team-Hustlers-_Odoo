import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    // Only search if query is at least 2 characters
    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 5, // Limit results
      orderBy: {
        name: 'asc', // Sort results
      },
      // Add caching hints
      cacheStrategy: { ttl: 60 }, // 60 seconds cache
    });

    // Cache the response for 1 minute
    const response = NextResponse.json(users);
    response.headers.set('Cache-Control', 'public, max-age=60');
    
    return response;
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}
