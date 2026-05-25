import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
