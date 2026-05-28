import { DEFAULT_ANTHROPIC_MODEL } from '../resume/constants/ai.constants';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  anthropicModel: process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL,
  nodeEnv: process.env.NODE_ENV || 'development',
});
