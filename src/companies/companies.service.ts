import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './shecman/company.schema';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';



@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }
  create(createCompanyDto: CreateCompanyDto) {
    return this.companyModel.create({ ...createCompanyDto });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.companyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },

      result //kết quả query
    }
    // .skip(skip)
    // .limit(limit)
    // .sort(sort)
    // .select(projection)
    // .populate(population)
    // .exec((err, users) => {
    //   if (err) {
    //     return next(err);
    //   }

    //   res.send(users);
    // });

  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found company with id=${id}`);
    }
    return await this.companyModel.findById(id);
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto, updateBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    const deleted = this.companyModel.softDelete({ _id: id });
    return deleted;
  }
}
