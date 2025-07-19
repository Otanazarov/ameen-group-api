import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FindAllAdminQueryDto } from './dto/findAll-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RefreshAdminDto } from './dto/refresh-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto): Promise<{
        name: string;
        password: string;
        refreshToken: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginAdminDto: LoginAdminDto): Promise<{
        admin: {
            name: string;
            password: string;
            refreshToken: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshAdminDto: RefreshAdminDto): Promise<{
        accessToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    me(req: any): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: FindAllAdminQueryDto): Promise<{
        total: number;
        page: number;
        limit: number;
        data: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findOne(id: string): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateAdminDto: UpdateAdminDto): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
