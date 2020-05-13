import { IsNumber, IsString, ValidateNested } from 'class-validator';

class CategoryInPostDto {
    @IsNumber()
    public id: number;
}

class CreatePostDto {
    @IsString()
    public content: string;

    @IsString()
    public title: string;

    @IsString()
    public author: string;
}

export default CreatePostDto;