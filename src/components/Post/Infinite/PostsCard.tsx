import { AspectRatio, createStyles } from '@mantine/core';

import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { ImageGuard } from '~/components/ImageGuard/ImageGuard';
import { MediaHash } from '~/components/ImageHash/ImageHash';
import { MasonryCard } from '~/components/MasonryGrid/MasonryCard';
import { PostsInfiniteModel } from '~/server/services/post.service';
import { PostReactions } from '~/components/Reaction/Reactions';
import { RoutedDialogLink } from '~/components/Dialog/RoutedDialogProvider';
import { OnsiteIndicator } from '~/components/Image/Indicators/OnsiteIndicator';
import { useInView } from '~/hooks/useInView';

export function PostsCard({
  data: { image, id, stats, imageCount },
  height,
}: {
  data: PostsInfiniteModel;
  height?: number;
}) {
  const { ref, inView } = useInView({ rootMargin: '600px' });
  const { classes } = useStyles();

  return (
    <MasonryCard withBorder shadow="sm" p={0} height={height} ref={ref}>
      {inView && (
        <>
          <ImageGuard
            images={[image]}
            connect={{ entityId: id, entityType: 'post' }}
            render={(image) => (
              <ImageGuard.Content>
                {({ safe }) => (
                  <>
                    {image.meta && 'civitaiResources' in (image.meta as object) && (
                      <OnsiteIndicator />
                    )}
                    <ImageGuard.Report context="post" />
                    <ImageGuard.ToggleConnect position="top-left" />
                    <RoutedDialogLink
                      name="postDetail"
                      state={{ postId: id }}
                      style={{ zIndex: 210 }}
                    >
                      {!safe ? (
                        <AspectRatio ratio={(image?.width ?? 1) / (image?.height ?? 1)}>
                          <MediaHash {...image} />
                        </AspectRatio>
                      ) : (
                        <EdgeMedia
                          src={image.url}
                          name={image.name ?? image.id.toString()}
                          alt={image.name ?? undefined}
                          type={image.type}
                          width={450}
                          placeholder="empty"
                          style={{ width: '100%', position: 'relative' }}
                        />
                      )}
                    </RoutedDialogLink>
                    <PostReactions
                      className={classes.reactions}
                      imageCount={imageCount}
                      metrics={{
                        likeCount: stats?.likeCount,
                        dislikeCount: stats?.dislikeCount,
                        heartCount: stats?.heartCount,
                        laughCount: stats?.laughCount,
                        cryCount: stats?.cryCount,
                      }}
                    />
                  </>
                )}
              </ImageGuard.Content>
            )}
          />
        </>
      )}
    </MasonryCard>
  );
}

const useStyles = createStyles((theme) => ({
  title: {
    lineHeight: 1.1,
    fontSize: 14,
    color: 'white',
    fontWeight: 500,
  },
  reactions: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    borderRadius: theme.radius.sm,
    background: theme.fn.rgba(
      theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
      0.8
    ),
    backdropFilter: 'blur(13px) saturate(160%)',
    boxShadow: '0 -2px 6px 1px rgba(0,0,0,0.16)',
    padding: 4,
  },
}));
