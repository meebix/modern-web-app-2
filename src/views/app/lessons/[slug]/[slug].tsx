import React from 'react';
import cx from 'classnames';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useVideo } from '@hooks/use-video';
import {
  useGetProductVideos,
  useSetProductVideoWatched,
} from '@modules/queries/product-videos';
import { VideoPlayer } from '@components/app/video-player';
import { Button } from '@components/app';
import { ReducerAction } from '@typings/react';
import { markdownToHtml } from '@modules/markdown-to-html';
import { ReducerState, initialState, types } from './reducer';

const SocialSharing = dynamic(() => import('@features/social-sharing'), {
  ssr: false,
});

type LessonsProps = {
  descriptionHtml: string;
};

const Lessons = ({ descriptionHtml }: LessonsProps) => {
  const router = useRouter();
  const playerRef = React.useRef(null);
  const [setProductVideoWatched] = useSetProductVideoWatched();

  const lessonSlug = router.query.slug as string;

  const [state, dispatch] = React.useReducer(
    (
      reducerState: ReducerState,
      action: ReducerAction<Partial<ReducerState>>
    ): ReducerState => {
      switch (action.type) {
        case types.SET_ACTIVE_VIDEO_ID:
          return {
            ...reducerState,
            activeVideoId: action.payload?.activeVideoId || '',
          };
        case types.SET_VIDEO_ENDED: {
          setProductVideoWatched({
            productVideoId: reducerState.activeVideoId,
          });

          return {
            ...reducerState,
            videoEnded: action.payload?.videoEnded || true,
          };
        }
        default:
          return reducerState;
      }
    },
    initialState
  );

  const { isReady: isPlayerReady, setSrc, changeSrc } = useVideo({
    playerRef,
    onEnded: () => {
      dispatch({ type: types.SET_VIDEO_ENDED, payload: { videoEnded: true } });
    },
  });

  const { data: productVideos, isLoading } = useGetProductVideos(
    {
      lessonSlug,
    },
    {
      enabled: lessonSlug,
    }
  );

  React.useEffect(() => {
    if (isPlayerReady && !isLoading && productVideos?.data.length) {
      const preSelectedLesson = productVideos.data.find(
        (row) => row.attributes.slug === lessonSlug
      );

      const firstLesson = productVideos.data.find(
        (row) => row.attributes.ordering === 1
      );

      dispatch({
        type: types.SET_ACTIVE_VIDEO_ID,
        payload: {
          activeVideoId: preSelectedLesson
            ? preSelectedLesson?.attributes.id
            : firstLesson?.attributes.id || '',
        },
      });

      setSrc(
        preSelectedLesson
          ? preSelectedLesson?.attributes.video_url
          : firstLesson?.attributes.video_url || ''
      );

      document.getElementById(lessonSlug)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [productVideos, isPlayerReady, lessonSlug, isLoading]);

  return (
    <div>
      <div>Course</div>
      <div className="grid grid-cols-2">
        <div className="col-start-1 col-end-1">
          <VideoPlayer ref={playerRef} />
        </div>

        <div className="col-start-2 col-end-2 h-64 overflow-y-scroll">
          <ul>
            {productVideos?.data.map((result, index) => {
              const listItemRef = React.createRef<HTMLLIElement>();
              const [minutes, seconds = '00'] = String(
                result.attributes.length / 100
              ).split('.');

              const handleClick = () => {
                listItemRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              };

              return (
                <li
                  key={result.attributes.id}
                  id={result.attributes.slug}
                  ref={listItemRef}
                  className={cx({
                    'text-red-500':
                      state.activeVideoId === result.attributes.id,
                  })}
                >
                  {result.meta?.watched && <div>Watched</div>}
                  <div>{index + 1}</div>
                  <Button.Link
                    onClick={() => {
                      changeSrc(result.attributes.video_url);

                      dispatch({
                        type: types.SET_ACTIVE_VIDEO_ID,
                        payload: { activeVideoId: result.attributes.id || '' },
                      });

                      handleClick();
                    }}
                  >
                    {result.attributes.title}
                  </Button.Link>

                  <div>{result.attributes.description}</div>
                  <div>
                    {minutes}:{seconds}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <SocialSharing
        twitter={{ title: 'title' }}
        facebook={{ title: 'title' }}
      />

      <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
    </div>
  );
};

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lessonMarkdown = await markdownToHtml(
    'src/views/app/lessons/descriptions',
    query.slug as string
  );

  return {
    props: {
      descriptionHtml: lessonMarkdown.contentHtml,
    },
  };
};

export { Lessons, getServerSideProps };
