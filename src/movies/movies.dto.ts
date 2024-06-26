import { Category, Prisma, } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


type Movie = Prisma.MovieGetPayload<{
    include: {
        user: true
    }
}>

export class CreateMovieDto {

    @IsString()
    @IsNotEmpty()
    directorName: string;

    @IsString()
    @IsNotEmpty()
    movieName: string;

    @IsNumber()
    @IsNotEmpty()
    yearReleased: number;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsEnum(Category)
    @IsNotEmpty()
    category: Category

    @IsString()
    @IsOptional()
    trailer: string
}

export class MovieDto {

    id: number

    directorName: string;

    name: string;

    yearReleased: number;

    image: string;

    category: string;

    trailer: string

    creator: { id: number, name: string }


    public static create(movie: Movie) {
        const dto = new MovieDto()

        dto.id = movie.id
        dto.image = movie.image
        dto.trailer = movie.trailer
        dto.name = movie.movieName
        dto.category = movie.category
        dto.yearReleased = movie.yearReleased
        dto.creator = { id: movie.user.id, name: movie.user.name }

        return dto
    }
}