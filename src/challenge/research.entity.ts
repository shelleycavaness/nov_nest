import { Column, Entity } from "typeorm";
import { ChallengeEntity } from "./challenge.entity";

@Entity()
export class Research extends ChallengeEntity {

    @Column()
    links: string;

}