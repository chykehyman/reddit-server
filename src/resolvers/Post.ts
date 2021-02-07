import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Post } from '../entities/Post';
import { MyContext } from '../types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => String) id: string,
    @Ctx() { em }: MyContext): Promise<Post | null> {
    return em.findOne(Post, { _id: id });
  }
    
  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { em }: MyContext): Promise<Post> {
    const post = em.create(Post, { title }) 
    await em.persistAndFlush(post)
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => String) id: string,
    @Arg('title', () => String, {nullable: true }) title: string,
    @Ctx() { em }: MyContext): Promise<Post | null> {
    const post = await em.findOne(Post, { _id: id });
    if (!post) return null
    if (typeof title !== 'undefined') {
      post.title = title
      await em.persistAndFlush(post)
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => String) id: string,
    @Ctx() { em }: MyContext): Promise<boolean> {
    await em.nativeDelete(Post, { _id: id })
    return true;
  }
}