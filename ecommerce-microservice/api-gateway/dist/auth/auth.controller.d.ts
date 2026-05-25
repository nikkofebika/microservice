import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(data: any): Promise<any>;
    login(data: any): Promise<any>;
}
