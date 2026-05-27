export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
  nodeEnv: process.env.NODE_ENV || 'development',
});
