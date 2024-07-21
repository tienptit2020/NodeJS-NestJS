import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Create a new User")
  async create(@Body() hoidanit: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(hoidanit, user);
    return {
      _id: newUser,
      createdAt: newUser
    };
  }

  @ResponseMessage('Cập nhật người dùng')
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }
  @Delete(':id')
  @ResponseMessage("Xóa người dùng")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }


  @Get()
  @ResponseMessage('Fetch user with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }


  @Public()
  @Get(':id')
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }





}