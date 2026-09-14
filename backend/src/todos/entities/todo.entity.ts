import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export enum TodoStatus {
  Pending = 'Pending',
  Completed = 'Completed',
}

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'simple-enum', enum: TodoStatus, default: TodoStatus.Pending })
  status: TodoStatus;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.todos, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'datetime', nullable: true })
  dueAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
