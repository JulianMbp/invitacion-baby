import { ConfirmationStatus, NOCODB_API_TOKEN, NOCODB_API_URL, TABLES, TeamStatus } from './constants';

export interface Guest {
    Id: number;
    'Nombre Representante': string;
    'N° Integrantes': number;
    Residencia?: string;
    Celular?: string;
    correo?: string;
    Confirmado?: boolean; // Old field - deprecated
    confirmacion?: number; // Enum: 1=Pending, 2=Confirmed, 3=Declined
    'N° de Integrantes confirmados'?: number; // Number of confirmed attendees
    team?: number; // Enum: 0=None, 1=Pink, 2=Blue
    invited?: boolean; // internal flag
}

export interface Gift {
    Id: number;
    Item: string;
    Description?: string;
    Category?: string;
    PriceRange?: string;
    ReservedBy?: string; // Stores Guest ID as string or number
    IsReserved?: boolean;
}

const HEADERS = {
    'xc-token': NOCODB_API_TOKEN,
    'Content-Type': 'application/json',
};

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${NOCODB_API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...HEADERS,
            ...options.headers,
        },
    });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorBody}`);
    }
    return res.json();
}

export async function getGuestById(id: string | number): Promise<Guest | null> {
    try {
        const res = await fetchAPI(`/api/v2/tables/${TABLES.GUESTS}/records/${id}`);
        // Log the response to debug ID field structure
        console.log('Guest record from API:', res);
        return res;
    } catch (error) {
        console.error("Error fetching guest:", error);
        return null;
    }
}

export async function confirmGuestAttendance(id: number, status: ConfirmationStatus, integrantesConfirmados?: number): Promise<any> {
    // Get the full record first to include all fields in the update
    const currentRecord = await getGuestById(id);
    if (!currentRecord) {
        throw new Error('Record not found');
    }
    
    // Filter out auto-generated fields and internal fields that shouldn't be sent
    const { CreatedAt, UpdatedAt, invited, ...recordToUpdate } = currentRecord as any;
    
    // Prepare update object
    const updateData: any = {
        ...recordToUpdate,
        confirmacion: status, // Set the confirmation status enum value
    };
    
    // If confirming attendance (status = 2) and integrantesConfirmados is provided, update it
    if (status === ConfirmationStatus.CONFIRMED && integrantesConfirmados !== undefined) {
        updateData['N° de Integrantes confirmados'] = integrantesConfirmados;
    } else if (status === ConfirmationStatus.DECLINED) {
        // If declined, reset integrantes confirmados
        updateData['N° de Integrantes confirmados'] = null;
    }
    
    // NocoDB PATCH endpoint: /api/v2/tables/{tableId}/records (no ID in URL)
    // Must include all fields in the body, updating only the ones we want to change
    return await fetchAPI(`/api/v2/tables/${TABLES.GUESTS}/records`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
    });
}

export async function updateGuestTeam(id: number, team: TeamStatus): Promise<any> {
    // Get the full record first to include all fields in the update
    const currentRecord = await getGuestById(id);
    if (!currentRecord) {
        throw new Error('Record not found');
    }
    
    // Filter out auto-generated fields and internal fields that shouldn't be sent
    const { CreatedAt, UpdatedAt, invited, ...recordToUpdate } = currentRecord as any;
    
    // Prepare update object
    const updateData: any = {
        ...recordToUpdate,
        team: team, // Set the team enum value
    };
    
    // NocoDB PATCH endpoint: /api/v2/tables/{tableId}/records (no ID in URL)
    // Must include all fields in the body, updating only the ones we want to change
    return await fetchAPI(`/api/v2/tables/${TABLES.GUESTS}/records`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
    });
}

export async function getGifts(): Promise<Gift[]> {
    const res = await fetchAPI(`/api/v2/tables/${TABLES.GIFTS}/records?limit=1000&shuffle=0&offset=0`);
    return res.list || [];
}

export async function reserveGift(giftId: number, guestId: number): Promise<any> {
    // Get the full gift record first to include all fields in the update
    const gifts = await getGifts();
    const currentGift = gifts.find(g => g.Id === giftId);
    if (!currentGift) {
        throw new Error('Gift not found');
    }
    
    // Filter out auto-generated fields that shouldn't be sent
    const { CreatedAt, UpdatedAt, ...giftToUpdate } = currentGift as any;
    
    // NocoDB PATCH endpoint: /api/v2/tables/{tableId}/records (no ID in URL)
    // Must include all fields in the body, updating only the ones we want to change
    return await fetchAPI(`/api/v2/tables/${TABLES.GIFTS}/records`, {
        method: 'PATCH',
        body: JSON.stringify({
            ...giftToUpdate,
            ReservedBy: String(guestId),
            IsReserved: true,
        }),
    });
}

export async function unreserveGift(giftId: number): Promise<any> {
    // Get the full gift record first to include all fields in the update
    const gifts = await getGifts();
    const currentGift = gifts.find(g => g.Id === giftId);
    if (!currentGift) {
        throw new Error('Gift not found');
    }
    
    // Filter out auto-generated fields that shouldn't be sent
    const { CreatedAt, UpdatedAt, ...giftToUpdate } = currentGift as any;
    
    // NocoDB PATCH endpoint: /api/v2/tables/{tableId}/records (no ID in URL)
    // Must include all fields in the body, updating only the ones we want to change
    return await fetchAPI(`/api/v2/tables/${TABLES.GIFTS}/records`, {
        method: 'PATCH',
        body: JSON.stringify({
            ...giftToUpdate,
            ReservedBy: null,
            IsReserved: false,
        }),
    });
}

export async function createGift(gift: Partial<Gift>): Promise<any> {
    return fetchAPI(`/api/v2/tables/${TABLES.GIFTS}/records`, {
        method: 'POST',
        body: JSON.stringify(gift),
    });
}
