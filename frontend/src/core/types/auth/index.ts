export interface Payload{
    sub: string; 
    iat: number;
    exp: number;
    roles?: string[];
}

export interface TokenSecurityResponse{
    token:string;
}