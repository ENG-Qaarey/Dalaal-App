import { NotificationType } from '../../common/enums';
export declare class CreateNotificationDto {
    type: NotificationType;
    title: string;
    body: string;
    data?: any;
    actionUrl?: string;
}
