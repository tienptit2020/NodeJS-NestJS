import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const {
      name, apiPath, method, module
    } = createPermissionDto;

    const isExist
      =
      await this.permissionModel.findOne({ apiPath, method });
    if (isExist) {
      throw new BadRequestException(`Permission với apiPath=${apiPath} , method=${method} daton tại`)
    }
    let newPermission = await this.permissionModel.create({
      name, apiPath, method, module,
      createdBy: {
        id: user._id,
        email: user.email
      }
    })

    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt
    };


  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();
    return {
      meta: {
        currentPage: currentPage,
        pageSize: limit, //số lượng trên mỗi trang
        pages: totalPages,
        total: totalItems //kết quả query
      },
      result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found permission';

    return await this.permissionModel.findById(id);
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found permission")
    }

    const { module, method, apiPath, name } = updatePermissionDto;
    const updated = await this.permissionModel.updateOne(
      { _id },
      {
        module, method, apiPath, name,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }

  async remove(id: string, user: IUser) {

    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.permissionModel.softDelete({ _id: id });
  }
}

