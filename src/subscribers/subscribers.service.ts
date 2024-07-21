import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from './schema/subscriber.schema';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {

  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) { }


  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const {
      name, email, skills
    } = createSubscriberDto;


    const isExist = await this.subscriberModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email :"${email}" đã tồn tại!`)
    }

    const newSubs = await this.subscriberModel.create({
      name, email, skills,
      createdBy: {
        id: user._id,
        email: user.email
      }
    })

    return {
      _id: newSubs?._id,
      createdAt: newSubs?.createdAt
    };


  }


  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.subscriberModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select('-password')
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
      return `not found subscribers`;
    return await this.subscriberModel.findOne({
      _id: id
    }
    )
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {



    const updated = await this.subscriberModel.updateOne(
      { _id: id },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      },
    );
    return updated;
  }






  async remove(id: string, user: IUser) {




    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "not found role";
    }
    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.subscriberModel.softDelete({ _id: id });
  }


}
