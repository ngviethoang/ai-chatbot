const { router, text, payload, messenger } = require('bottender/router');
const { SERVICES, Service_Type, Payload_Type } = require('./const');
const {
  objectToJsonWithTruncatedUrls,
  selectService,
  checkActiveService,
  showActiveService,
  clearServiceData,
  setValueForQuery,
  setQueryForService,
} = require('./helper');
const { runPrediction } = require('./models/prediction');

async function Command(
  context,
  {
    match: {
      groups: { command, content },
    },
  }
) {
  // await context.sendText(`Executing command ${command} with content: ${content}`);
  switch (command.toLowerCase()) {
    case 'h':
    case 'help':
      await context.sendText(
        'Commands\n[s] Select a service\n[a] Active service\n[c] Clear context\n[d] Debug'
      );
      break;
    case 's':
    case 'service':
      await selectService(context);
      break;
    case 'a':
    case 'active':
      if (await checkActiveService(context)) {
        await showActiveService(context);
      }
      break;
    case 'c':
    case 'clear':
      if (await checkActiveService(context)) {
        await clearServiceData(context);
      }
      break;
    case 'd':
    case 'debug':
      await context.sendText(objectToJsonWithTruncatedUrls(context.state));
      break;
    default:
      await context.sendText('Sorry. Command not found.');
      break;
  }
}

async function Others(context, props) {
  if (!(await checkActiveService(context))) {
    return;
  }
  const activeService = SERVICES[context.state.service];
  if (
    [Service_Type.Prediction, Service_Type.DallE].includes(activeService.type)
  ) {
    setValueForQuery(context, 'text', context.event.text);
  } else if (activeService.type === Service_Type.Chat) {
    const question = context.event.text;
    const response = await activeService.getAnswer(context, [
      ...context.state.context,
      question,
    ]);
    context.setState({
      ...context.state,
      context: [...context.state.context, question, response],
    });
    await context.sendText(response);
  }
}

async function Payload(context, props) {
  const payload = context.event.payload;
  // Select a service
  if (payload.startsWith(Payload_Type.Select_Service)) {
    const service = parseInt(payload.replace(Payload_Type.Select_Service, ''));
    context.setState({
      ...context.state,
      service,
      query: {},
      context: [],
    });
    await showActiveService(context);
  }
  // Select a param option
  if (payload.startsWith(Payload_Type.Select_Query_Option)) {
    const [_, field, value] = payload.split(Payload_Type.Splitter);
    setQueryForService(context, field, value);
  }
}

async function HandleImage(context) {
  if (!(await checkActiveService(context))) {
    return;
  }
  const activeService = SERVICES[context.state.service];
  if (
    [Service_Type.Prediction, Service_Type.DallE].includes(activeService.type)
  ) {
    setValueForQuery(context, 'image', context.event.image.url);
  } else {
    await context.sendText(`received the image: ${context.event.image.url}`);
  }
}

async function HandleAudio(context) {
  if (!(await checkActiveService(context))) {
    return;
  }
  const activeService = SERVICES[context.state.service];
  if ([Service_Type.Prediction].includes(activeService.type)) {
    setValueForQuery(context, 'audio', context.event.audio.url);
  } else {
    await context.sendText(`received the audio: ${context.event.audio.url}`);
  }
}

async function HandleVideo(context) {
  await context.sendText(`received the video: ${context.event.video.url}`);
}

async function HandleFile(context) {
  await context.sendText(`received the file: ${context.event.file.url}`);
}

async function HandleLocation(context) {
  const { coordinates } = context.event.location;
  await context.sendText(
    `received the location: lat: ${coordinates.lat}, long: ${coordinates.long}`
  );
}

async function Submit(context, props) {
  if (!(await checkActiveService(context))) {
    return;
  }
  const activeService = SERVICES[context.state.service];
  if ([Service_Type.Prediction].includes(activeService.type)) {
    runPrediction(context);
  } else if ([Service_Type.DallE].includes(activeService.type)) {
    activeService.getAnswer(context);
  } else {
    Others(context, props);
  }
}

module.exports = async function App(context, props) {
  if (context.event.isImage) {
    return HandleImage;
  }
  if (context.event.isAudio) {
    return HandleAudio;
  }
  if (context.event.isVideo) {
    return HandleVideo;
  }
  if (context.event.isFile) {
    return HandleFile;
  }
  if (context.event.isLocation) {
    return HandleLocation;
  }
  return router([
    payload('*', Payload),
    // return the `Command` action when receiving "/join", "/invite", or "/whatever" text messages
    text(/^[/.](?<command>\w+)(?:\s(?<content>.+))?/i, Command),
    text(/^ok$/i, Submit),
    text('*', Others),
  ]);
};
