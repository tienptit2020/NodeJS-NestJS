import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage("create new job")
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch job with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Public()
  @Get(':id')
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.subscribersService.findOne(id);
    return foundUser;
  }


  @Patch(':id')
  @ResponseMessage("update a job ")
  update(@Param('id') id: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser
  ) {
    return this.subscribersService.update(id, updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a job")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }

}
