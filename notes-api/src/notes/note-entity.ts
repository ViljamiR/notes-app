import { Column, Entity, PrimaryGeneratedColumn, Generated, PrimaryColumn } from 'typeorm';

@Entity()
class Note {
    @PrimaryColumn()
    public id?: number;

    @Column()
    public title: string;

    @Column()
    public content: string;

    @Column()
    public author: string;

    @Column()
    @Generated('increment')
    public order: number;


}

export default Note;