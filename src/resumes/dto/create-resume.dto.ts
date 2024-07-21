import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({ message: 'email không được trống' })
    email: string;

    @IsNotEmpty({ message: 'userId không được trống' })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'url không được trống' })
    url: string;

    @IsNotEmpty({ message: 'status không được trống' })
    status: string;

    @IsNotEmpty({ message: 'userId không được trống' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'userId không được trống' })
    jobId: mongoose.Schema.Types.ObjectId;

}
export class CreateUserCvDto {
    @IsNotEmpty({ message: 'url không được trống' })
    url: string;

    @IsNotEmpty({ message: 'companyId không được trống' })
    @IsMongoId({ message: 'companyId is a mongo id' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'companyId không được trống' })
    @IsMongoId({ message: 'companyId is a mongo id' })
    jobId: mongoose.Schema.Types.ObjectId;

}