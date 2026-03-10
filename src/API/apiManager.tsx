const currentURL = window.location.href;

const API_URL =
  currentURL.includes('localhost') || currentURL.includes('demo')
    ? 'https://api-canaldenuncias.pollvo.com/dev'
    : 'https://api-canaldenuncias.pollvo.com/prod';

let API_BASE: string;

switch (true) {
  case currentURL.includes('localhost') || currentURL.includes('demo'):
    API_BASE = 'localhost';
    break;
  case currentURL.includes('sbaraini'):
    API_BASE = 'sbaraini';
    break;
  case currentURL.includes('estrela'):
    API_BASE = 'estrela';
    break;
  default:
    API_BASE = currentURL.split(/[-.]/)[1];
    break;
}

const API_AUTH =
  currentURL.includes('localhost') || currentURL.includes('demo')
    ? 'https://auth.pollvo.com/dev'
    : 'https://auth.pollvo.com/prod';

const AUTH_ENV =
  currentURL.includes('localhost') || currentURL.includes('demo')
    ? 'HML'
    : 'PRD';

export { API_URL, API_BASE, API_AUTH, AUTH_ENV };

// const currentURL = window.location.href;

// const API_URL =
//   currentURL.includes('localhost') || currentURL.includes('demo')
//     ? 'https://api-canaldenuncias.pollvo.com/dev'
//     : 'https://api-canaldenuncias.pollvo.com/prod';

// // const API_BASE =
// //   currentURL.includes('localhost') || currentURL.includes('demo')
// //     ? 'localhost'
// //     : currentURL.split(/[-.]/)[1];
// // const API_BASE =

// let API_BASE: string;

// if (currentURL.includes('localhost') || currentURL.includes('demo')) {
//   API_BASE = 'localhost';
// } else if (currentURL.includes('sbaraini')) {
//   API_BASE = 'sbaraini';
// } else {
//   API_BASE = currentURL.split(/[-.]/)[1];
// }

// export { API_URL, API_BASE };
