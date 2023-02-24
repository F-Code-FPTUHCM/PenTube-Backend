import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleLoginGuard extends AuthGuard('google') {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    matchRole(roles: string[], userRole: string) {
        return roles.includes(userRole);
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const roles = this.reflector.get<string[]>('role', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return this.matchRole(roles, user.role);
    }
}
