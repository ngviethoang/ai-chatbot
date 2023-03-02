import { MessengerContext } from "bottender";
import { getActiveService } from "../context";

export const handleChat = async (context: MessengerContext, text: string) => {
  const activeService = getActiveService(context);
  const response = await activeService.getAnswer(context, [
    ...context.state.context as any,
    { role: 'user', content: text },
  ]);
  if (!response) {
    await context.sendText(
      'Sorry! Please try again or create new conversation by `/c`'
    );
    return;
  }
  await context.sendText(response);
  context.setState({
    ...context.state,
    context: [
      ...context.state.context as any,
      { role: 'user', content: text },
      { role: 'assistant', content: response },
    ],
  });
}