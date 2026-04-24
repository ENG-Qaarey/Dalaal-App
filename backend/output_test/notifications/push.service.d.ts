export declare class PushService {
    private readonly logger;
    sendPush(userId: string, title: string, body: string, data?: any): Promise<void>;
}
