import { Injectable, NotFoundException } from '@nestjs/common';
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
                take
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
                data
            })
            return MovieDto.create(updatedMovie)
        } catch (error) {
            throw error
        }


    }

}