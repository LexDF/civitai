import { HaiperVideoGenModel } from '@civitai/client';
import {
  negativePromptSchema,
  seedSchema,
  textEnhancementSchema,
} from './../infrastructure/base.schema';
import z from 'zod';
import {
  imageEnhancementSchema,
  promptSchema,
} from '~/server/orchestrator/infrastructure/base.schema';
import { numberEnum } from '~/utils/zod-helpers';
import { VideoGenerationConfig } from '~/server/orchestrator/infrastructure/GenerationConfig';
import {
  enablePromptEnhancerInput,
  promptInput,
} from '~/server/orchestrator/infrastructure/base.inputs';
import { WorkflowConfigInputProps } from '~/server/orchestrator/infrastructure/input.types';

export const haiperAspectRatios = ['16:9', '4:3', '1:1', '3:4', '9:16'] as const;
export const haiperDuration = [2, 4, 8] as const;
export const haiperResolution = [720, 1080, 2160] as const;

const baseHaiperSchema = z.object({
  engine: z.literal('haiper'),
  workflow: z.string(),
  model: z
    .nativeEnum(HaiperVideoGenModel)
    .default(HaiperVideoGenModel.V2)
    .catch(HaiperVideoGenModel.V2),
  enablePromptEnhancer: z.boolean().default(true),
  duration: numberEnum(haiperDuration).default(4).catch(4),
  seed: seedSchema,
  resolution: numberEnum(haiperResolution).default(1080),
});

const haiperTxt2VidSchema = textEnhancementSchema.merge(baseHaiperSchema).extend({
  negativePrompt: negativePromptSchema,
  aspectRatio: z.enum(haiperAspectRatios).default('1:1').catch('1:1'),
});

const haiperImg2VidSchema = imageEnhancementSchema
  .merge(baseHaiperSchema)
  .extend({ prompt: promptSchema });

const haiperDurationInput: WorkflowConfigInputProps = {
  type: 'segmented-control',
  label: 'Duration',
  options: haiperDuration.map((value) => ({ label: `${value}s`, value })),
};

const haiperTxt2ImgConfig = new VideoGenerationConfig({
  subType: 'txt2vid',
  engine: 'haiper',
  schema: haiperTxt2VidSchema,
  metadataDisplayProps: ['aspectRatio', 'duration', 'seed', 'resolution'],
  inputs: ['prompt', 'enablePromptEnhancer'],
  // inputs: {
  //   prompt: promptInput,
  //   enablePromptEnhancer: enablePromptEnhancerInput,
  // },
});

const haiperImg2VidConfig = new VideoGenerationConfig({
  subType: 'img2vid',
  engine: 'haiper',
  schema: haiperImg2VidSchema,
  metadataDisplayProps: ['duration', 'seed', 'resolution'],
  inputs: ['prompt', 'enablePromptEnhancer'],
});

export const haiperVideoGenerationConfig = [haiperTxt2ImgConfig, haiperImg2VidConfig];
