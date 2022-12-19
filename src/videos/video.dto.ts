export class videoDTO {
    title: string;
    description: string;
    category?: string;
    tags?: string[];
    url: string;
    status: string;
    key?: string;
    views?: string[];
    likes?: string[];
    dislikes?: string[];
    totalViews?: number;
    createdAt: Date;
    updatedAt: Date;
}

export class viewDTO {
    userId: string;
    frameWatched: number;
    count: number;
    location: string;
}
