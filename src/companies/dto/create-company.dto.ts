import { IsEmail, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

//data transfer object // class = { }
export class CreateCompanyDto {

    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsNotEmpty({ message: 'Address không được để trống', })
    address: string;
    @IsNotEmpty({ message: 'Drescription không được để trống', })
    description: string;

    createdBy: {
        _id: string;
        email: string;
    };

    updateBy: {
        _id: string;
        email: string;
    };

    deletedBy: {
        _id: string;
        email: string;
    };

    @IsNotEmpty({ message: 'logo không được để trống', })
    logo: string;
}