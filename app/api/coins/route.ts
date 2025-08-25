import { NextResponse } from 'next/server';

// Mock data - in productie uit database
const mockCoinsData = [
  {
    id: '1',
    name: 'Gouden Tientje',
    slug: 'gouden-tientje',
    metalType: 'GOLD',
    category: 'CIRCULATION',
    country: 'Nederland',
    variants: [
      {
        id: '1-1',
        yearFrom: 1875,
        yearTo: 1889,
        variantName: 'Willem III',
        weightGrams: 6.72,
        goldPercentage: 90.0,
        diameter: 22.5,
        mintage: 2825000
      },
      {
        id: '1-2',
        yearFrom: 1897,
        yearTo: 1897,
        variantName: 'Wilhelmina (jong)',
        weightGrams: 6.72,
        goldPercentage: 90.0,
        diameter: 22.5,
        mintage: 149000
      },
      {
        id: '1-3',
        yearFrom: 1911,
        yearTo: 1933,
        variantName: 'Wilhelmina (oud)',
        weightGrams: 6.72,
        goldPercentage: 90.0,
        diameter: 22.5,
        mintage: 15941000
      }
    ]
  },
  {
    id: '2',
    name: 'Gouden Vijfje',
    slug: 'gouden-vijfje',
    metalType: 'GOLD',
    category: 'CIRCULATION',
    country: 'Nederland',
    variants: [
      {
        id: '2-1',
        yearFrom: 1912,
        yearTo: 1933,
        variantName: 'Wilhelmina',
        weightGrams: 3.36,
        goldPercentage: 90.0,
        diameter: 18.5,
        mintage: 11392000
      }
    ]
  },
  {
    id: '3',
    name: 'Zilveren Gulden',
    slug: 'zilveren-gulden',
    metalType: 'SILVER',
    category: 'CIRCULATION',
    country: 'Nederland',
    variants: [
      {
        id: '3-1',
        yearFrom: 1818,
        yearTo: 1837,
        variantName: 'Willem I',
        weightGrams: 10.76,
        silverPercentage: 89.3,
        diameter: 30.0,
        mintage: 45000000
      },
      {
        id: '3-2',
        yearFrom: 1840,
        yearTo: 1849,
        variantName: 'Willem II',
        weightGrams: 10.0,
        silverPercentage: 94.5,
        diameter: 28.0,
        mintage: 25000000
      },
      {
        id: '3-3',
        yearFrom: 1850,
        yearTo: 1890,
        variantName: 'Willem III',
        weightGrams: 10.0,
        silverPercentage: 94.5,
        diameter: 28.0,
        mintage: 85000000
      },
      {
        id: '3-4',
        yearFrom: 1892,
        yearTo: 1919,
        variantName: 'Wilhelmina (jong)',
        weightGrams: 10.0,
        silverPercentage: 94.5,
        diameter: 28.0,
        mintage: 65000000
      },
      {
        id: '3-5',
        yearFrom: 1922,
        yearTo: 1945,
        variantName: 'Wilhelmina (oud)',
        weightGrams: 6.5,
        silverPercentage: 72.0,
        diameter: 25.0,
        mintage: 120000000
      },
      {
        id: '3-6',
        yearFrom: 1954,
        yearTo: 1967,
        variantName: 'Juliana',
        weightGrams: 6.5,
        silverPercentage: 72.0,
        diameter: 25.0,
        mintage: 225000000
      }
    ]
  },
  {
    id: '4',
    name: 'Zilveren Rijksdaalder',
    slug: 'zilveren-rijksdaalder',
    metalType: 'SILVER',
    category: 'CIRCULATION',
    country: 'Nederland',
    variants: [
      {
        id: '4-1',
        yearFrom: 1840,
        yearTo: 1849,
        variantName: 'Willem II',
        weightGrams: 25.0,
        silverPercentage: 94.5,
        diameter: 38.0,
        mintage: 12500000
      },
      {
        id: '4-2',
        yearFrom: 1850,
        yearTo: 1874,
        variantName: 'Willem III',
        weightGrams: 25.0,
        silverPercentage: 94.5,
        diameter: 38.0,
        mintage: 28750000
      }
    ]
  },
  {
    id: '5',
    name: 'Zilveren Tientje',
    slug: 'zilveren-tientje',
    metalType: 'SILVER',
    category: 'COMMEMORATIVE',
    country: 'Nederland',
    variants: [
      {
        id: '5-1',
        yearFrom: 1973,
        yearTo: 1973,
        variantName: 'Juliana 25 jaar',
        weightGrams: 25.0,
        silverPercentage: 72.0,
        diameter: 38.0,
        mintage: 4350000
      },
      {
        id: '5-2',
        yearFrom: 1970,
        yearTo: 1970,
        variantName: 'Bevrijding',
        weightGrams: 25.0,
        silverPercentage: 72.0,
        diameter: 38.0,
        mintage: 10000000
      },
      {
        id: '5-3',
        yearFrom: 1994,
        yearTo: 2001,
        variantName: 'Beatrix serie',
        weightGrams: 15.0,
        silverPercentage: 92.5,
        diameter: 33.0,
        mintage: null
      }
    ]
  },
  {
    id: '6',
    name: 'Zilveren Vijftig Gulden',
    slug: 'zilveren-vijftig-gulden',
    metalType: 'SILVER',
    category: 'COMMEMORATIVE',
    country: 'Nederland',
    variants: [
      {
        id: '6-1',
        yearFrom: 1982,
        yearTo: 1998,
        variantName: 'Diverse herdenkingen',
        weightGrams: 25.0,
        silverPercentage: 92.5,
        diameter: 38.0,
        mintage: null
      }
    ]
  },
  {
    id: '7',
    name: 'Zilveren Kwartje',
    slug: 'zilveren-kwartje',
    metalType: 'SILVER',
    category: 'CIRCULATION',
    country: 'Nederland',
    variants: [
      {
        id: '7-1',
        yearFrom: 1850,
        yearTo: 1890,
        variantName: 'Willem III',
        weightGrams: 3.18,
        silverPercentage: 64.0,
        diameter: 19.0,
        mintage: 150000000
      },
      {
        id: '7-2',
        yearFrom: 1892,
        yearTo: 1919,
        variantName: 'Wilhelmina (jong)',
        weightGrams: 3.18,
        silverPercentage: 64.0,
        diameter: 19.0,
        mintage: 125000000
      },
      {
        id: '7-3',
        yearFrom: 1926,
        yearTo: 1941,
        variantName: 'Wilhelmina (oud)',
        weightGrams: 3.18,
        silverPercentage: 64.0,
        diameter: 19.0,
        mintage: 85000000
      }
    ]
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validatie en sanitisatie van query parameters
    const metalType = searchParams.get('metalType')?.trim().slice(0, 10);
    const category = searchParams.get('category')?.trim().slice(0, 20);
    const slug = searchParams.get('slug')?.trim().slice(0, 50);

    // Whitelist toegestane waarden
    const allowedMetalTypes = ['GOLD', 'SILVER', 'PLATINUM'];
    const allowedCategories = ['CIRCULATION', 'COMMEMORATIVE', 'BULLION', 'PATTERN'];

    let filteredCoins = [...mockCoinsData];

    // Filter op metal type met validatie
    if (metalType) {
      const upperMetalType = metalType.toUpperCase();
      if (!allowedMetalTypes.includes(upperMetalType)) {
        return NextResponse.json(
          { error: 'Invalid metalType parameter' },
          { status: 400 }
        );
      }
      filteredCoins = filteredCoins.filter(coin => 
        coin.metalType === upperMetalType
      );
    }

    // Filter op category met validatie
    if (category) {
      const upperCategory = category.toUpperCase();
      if (!allowedCategories.includes(upperCategory)) {
        return NextResponse.json(
          { error: 'Invalid category parameter' },
          { status: 400 }
        );
      }
      filteredCoins = filteredCoins.filter(coin => 
        coin.category === upperCategory
      );
    }

    // Filter op specifieke munt met slug validatie
    if (slug) {
      // Valideer slug format (alleen letters, cijfers en hyphens)
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return NextResponse.json(
          { error: 'Invalid slug format' },
          { status: 400 }
        );
      }
      filteredCoins = filteredCoins.filter(coin => coin.slug === slug);
    }

    // Add computed fields
    const coinsWithMetadata = filteredCoins.map(coin => ({
      ...coin,
      variantCount: coin.variants.length,
      yearRange: {
        start: Math.min(...coin.variants.map(v => v.yearFrom)),
        end: Math.max(...coin.variants.map(v => v.yearTo || v.yearFrom))
      },
      weightRange: {
        min: Math.min(...coin.variants.map(v => v.weightGrams)),
        max: Math.max(...coin.variants.map(v => v.weightGrams))
      }
    }));

    return NextResponse.json({
      coins: coinsWithMetadata,
      count: coinsWithMetadata.length,
      filters: {
        metalType,
        category,
        slug
      }
    });

  } catch (error) {
    console.error('Error in coins API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coins data' },
      { status: 500 }
    );
  }
}

// POST endpoint voor het toevoegen van munten aan collectie (toekomstige functie)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validatie
    if (!body.coinId || !body.variantId) {
      return NextResponse.json(
        { error: 'Missing required fields: coinId and variantId' },
        { status: 400 }
      );
    }

    // Hier zou je de munt toevoegen aan de gebruiker's collectie in de database
    // Voor nu gewoon een success response
    
    return NextResponse.json({
      message: 'Coin added to collection successfully',
      coinId: body.coinId,
      variantId: body.variantId,
      addedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error adding coin to collection:', error);
    return NextResponse.json(
      { error: 'Failed to add coin to collection' },
      { status: 500 }
    );
  }
}