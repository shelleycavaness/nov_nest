import { Column, Entity } from "typeorm";
import { ChallengeEntity } from "./challenge.entity";

@Entity()
export class Activity extends ChallengeEntity {

    @Column()
    address: string;

}