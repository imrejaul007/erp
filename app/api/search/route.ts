import { NextRequest, NextResponse } from 'next/server';
import { withTenant } from '@/lib/apiMiddleware';
import { globalSearch, getSearchSuggestions } from '@/lib/search';
import { logger } from '@/lib/logger';

export const GET = withTenant(async (request: NextRequest, { tenantId, user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const mode = searchParams.get('mode'); // 'search' or 'suggest'

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Query too short',
      });
    }

    // Get suggestions for autocomplete
    if (mode === 'suggest') {
      const suggestions = await getSearchSuggestions(tenantId, query);
      return NextResponse.json({
        success: true,
        data: suggestions,
      });
    }

    // Full search
    const results = await globalSearch({
      tenantId,
      query,
      limit,
    });

    logger.info('Search performed', {
      query,
      resultsCount: results.length,
      userId: user.id,
      tenantId,
    });

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    logger.error('Search error', error, {
      userId: user.id,
      tenantId,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform search',
      },
      { status: 500 }
    );
  }
});
