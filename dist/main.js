"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = require("body-parser");
const app_module_1 = require("./app.module");
const config_1 = require("./common/config");
const httpException_filter_1 = require("./common/filter/httpException.filter");
const config_swagger_1 = require("./common/swagger/config.swagger");
const path_1 = require("path");
const jsonwebtoken_1 = require("jsonwebtoken");
const role_enum_1 = require("./common/auth/roles/role.enum");
const nestjs_api_reference_1 = require("@scalar/nestjs-api-reference");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: { origin: "*" },
        rawBody: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, "..", "public/uploads"), {
        prefix: "/uploads/",
    });
    app.setGlobalPrefix("/api");
    app.use("/webhook", bodyParser.raw({ type: "application/json" }));
    app.useGlobalFilters(new httpException_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => {
            const messages = errors.map((err) => {
                const constraints = Object.values(err.constraints || {});
                return `${err.property}: ${constraints.join(", ")}`;
            });
            return new common_1.BadRequestException(messages.join(" | "));
        },
    }));
    if (config_1.env.ENV == "dev") {
        const ApiDocs = swagger_1.SwaggerModule.createDocument(app, config_swagger_1.ApiSwaggerOptions);
        swagger_1.SwaggerModule.setup("docs", app, ApiDocs, {
            customCssUrl: "./public/swagger.css",
        });
        app.use("/ui", (0, nestjs_api_reference_1.apiReference)({
            content: ApiDocs,
            theme: "bluePlanet",
            layout: "modern",
            defaultHttpClient: {
                targetKey: "node",
                clientKey: "ofetch",
            },
            persistAuth: true,
            authentication: {
                preferredSecurityScheme: "token",
                securitySchemes: {
                    token: {
                        token: (0, jsonwebtoken_1.sign)({
                            id: 1,
                            role: role_enum_1.Role.Admin,
                            ignoreVersion: true,
                            tokenVersion: 0,
                        }, config_1.env.ACCESS_TOKEN_SECRET, {}),
                    },
                },
            },
        }));
    }
    await app.listen(config_1.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map