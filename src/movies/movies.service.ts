import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, MovieDto } from './movies.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditMovieDto } from './dto';


@Injectable()
export class MoviesService {
    constructor(private prismaService: PrismaService) { }

    async findMany(page: number, perPage: number, name?: string) {

        const [skip, take] = [(page - 1) * perPage, perPage]

        const where: any = {}

        if (name && name.trim().length > 0) {
            where.movieName = {
                contains: name,
                mode: "insensitive"
            }
        }

        const movies = await this.prismaService.movie.findMany(
            {
                where,
                skip,
                take,
                include: {
                    user: true
                }
            }
        )

        if (!movies) {
            throw new NotFoundException("Not found")
        }
        return movies.map((movie) => {
            return MovieDto.create(movie)
        })
    }
    async createMovie(data: CreateMovieDto, userId: number) {
        try {
            const movie = await this.prismaService.movie.create({
                data: {
                    ...data,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            })
            return movie
        } catch (error) {
            throw error
        }

    }

    async deleteMovie(id: number, userId: number): Promise<String> {
        try {
            const movie = await this.prismaService.movie.findUnique({
                where: { id, userId }
            })

            if (!movie) {
                throw new NotFoundException('Movie not found')
            }
            await this.prismaService.movie.delete({
                where: { id: movie.id }
            })

            const message = "Movie sucessfully deleted"

            return message
        } catch (error) {
            throw error
        }

    }

    async editMovie(userId: number, id: number, data: EditMovieDto) {

        try {
            const movie = await this.prismaService.movie.findUnique({
                where: { id, userId }
            })

            if (!movie) {
                throw new NotFoundException('Movie not found.')
            }
            const updatedMovie = await this.prismaService.movie.update({
                where: {
                    id
                },
                include: { user: true },
                data
            })
            return MovieDto.create(updatedMovie)
        } catch (error) {
            throw error
        }


    }

    async addMovieToMyList(userId: number, movieId: number) {

        try {
            const movie = await this.prismaService.movie.findUnique({
                where: { id: movieId }
            })

            if (!movie) throw new NotFoundException('Movie not found')

            const movieAlreadyInMyList = await this.prismaService.myList.findFirst({
                where: { movieId, userId }
            }).then((movie) => !!movie)

            if (movieAlreadyInMyList) throw new ConflictException('Movie already in my list')


            await this.prismaService.myList.create({
                data: {
                    movie: { connect: { id: movieId } },
                    user: { connect: { id: userId } }
                }
            })
            return {
                message: "Movie successfully added to my list",
                movie
            }
        } catch (error) {
            throw error
        }


    }
    async removeMovieFromMyList(userId: number, movieId: number) {

        try {
            const movie = await this.prismaService.movie.findUnique({
                where: { id: movieId }
            })

            if (!movie) throw new NotFoundException('Movie not found')

            const movieRemovedInMyList = await this.prismaService.myList.findFirst({
                where: { movieId, userId }
            })

            if (!movieRemovedInMyList) throw new NotFoundException("Movie not in my list")


            await this.prismaService.myList.delete({
                where: { id: movieRemovedInMyList.id }
            })
            return {
                message: "Movie successfully removed from my list",
                movie
            }
        } catch (error) {
            throw error
        }


    }

    async getMoviesToMyList(userId: number) {

        try {
            const movies = await this.prismaService.myList.findMany({
                where: { userId },
                include: { movie: true }
            }).then((data) => data.map(({ movie }) => movie))

            if (movies.length === 0) throw new NotFoundException('Movies not found')

            return movies


        } catch (error) {
            throw error
        }


    }




}