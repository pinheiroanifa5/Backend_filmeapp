import { Category, Movie } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

    creatorId: number

    trailer: string


    public static create(movie: Movie) {
        const dto = new MovieDto()

        dto.id = movie.id
        dto.image = movie.image
        dto.trailer = movie.trailer
        dto.name = movie.movieName
        dto.category = movie.category
        dto.creatorId = movie.userId
        dto.yearReleased = movie.yearReleased

        return dto
    }
}