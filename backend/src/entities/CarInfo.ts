import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('car_info')
export class CarInfo {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    brand!: string;

    @Column()
    model!: string;

    @Column()
    generation!: string;

    @Column('simple-array')
    headlightTypes!: string[];

    @Column({ type: 'text', nullable: true })
    headlightsDescription!: string;

    @Column({ type: 'text', nullable: true })
    framesSpecs!: string;

    @Column({ type: 'text', nullable: true })
    framesIssues!: string;

    @Column({ type: 'text', nullable: true })
    emulatorsSpecs!: string;

    @Column({ type: 'text', nullable: true })
    emulatorsIssues!: string;

    @Column({ type: 'text', nullable: true })
    mountsSpecs!: string;

    @Column({ type: 'text', nullable: true })
    mountsIssues!: string;

    @Column({ type: 'text', nullable: true })
    glassSpecs!: string;

    @Column({ type: 'text', nullable: true })
    glassIssues!: string;

    @Column({ type: 'text', nullable: true })
    additionalInfo!: string;

    @Column({ type: 'text', nullable: true })
    additionalIssues!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 