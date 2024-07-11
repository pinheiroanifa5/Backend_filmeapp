import { Controller, Get, Post, Delete, Body, Query, UseGuards, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { GetUser } from 'src/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateMovieDto, MovieDto } from './movies.dto';
import { EditMovieDto } from './dto';


@UseGuards(JwtGuard)
@Controller('movies')
export class MoviesController {
  PrismaService: any;
  constructor(private readonly movieService: MoviesService) { }

  @Get()
  async findAll(@Query("page") page: number, @Query("perPage") perPage: number, @Query("name") name?: string): Promise<MovieDto[]> {
    page = page && page > 0 ? page : 1
    perPage = perPage && perPage > 0 ? perPage : 10
    return await this.movieService.findMany(page, perPage, name)

  }


  @Post()
  async create(
    @Body() data: CreateMovieDto,
    @GetUser("id") userId: number
  ) {
    return await this.movieService.createMovie(data, userId)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @GetUser("id") userId: number): Promise<String> {
    return await this.movieService.deleteMovie(id, userId);
  }
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: EditMovieDto, @GetUser("id") userId: number): Promise<MovieDto> {

    return await this.movieService.editMovie(userId, id, data);
  }

  @Post("myList/:id")
  async addToMyList(
    @Param("id", ParseIntPipe) movieId: number,
    @GetUser("id") userId: number
  ) {
    return await this.movieService.addMovieToMyList(userId, movieId)
  }

  @Delete("myList/:id")
  async removeFromMyList(
    @Param("id", ParseIntPipe) movieId: number,
    @GetUser("id") userId: number
  ) {
    return await this.movieService.removeMovieFromMyList(userId, movieId)
  }
  @Get("myList/me")
  async getMoviesToMyList(
    @GetUser("id") userId: number
  ) {
    return await this.movieService.getMoviesToMyList(userId)
  }

}