## Create Playwright project

* We need to create a project folder
* Add a terminal on the project and execute command 
    - npm init playwright
* Select the options shown on terminal


## Add tests
* On tests folder we need to create a file and name as:
    - TestName.spec.js

## Start creating tests

**_On test file created we need to import {test} from the @playwright/test library as shown below example, this one has the test utilities we will need._** 

On the test file we will create a testas shown below, in the anonymous function we will need to pass **_{ browser , page }_** as parameters in curly braces so that the test knows is the browser utility from @playwright/test library, **_if we do not include them into curly braces it will be considered as a normal string_** and we will not be able to use the browser features on the test

const { test } = require("@playwright/test")

describe("Main Suite", async ()=>{
    test("First test", async ({ browser, page })=>{
        
    });
})

## Options to run tests
npx playwright test
    Runs the end-to-end tests.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example
    Runs the tests in a specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

  npx playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    npx playwright test

## Open generated reports 
To open last HTML report run:

  npx playwright show-report

## Execute tests
npx playwright test tests/test.spec.js

## Debug tests
npx playwright test tests/test.spec.js --debug

## Record and play test
To make a test and make playwright to autogenerate test code automatically
we need to enter on command line:
npx playwright path/for/tests.spec.js --codegen url
example 
npx playwright tests/tests.spec.js --codegen http://www.google.com

## Open report
npx playwright show-report

## Open traces
first we need to set up the playwright.conf.js to retain traces
download zip file either from HTML report page or from test-results/testFolder/trace.zip

goto https://trace.playwright.dev/ 
add the zip file

## DEBUG

we need to run the script with the flag **_--debug_**, it will start the test in debug mode from the first line.

## DEBUG WITH API/UI COMBINED TESTING
we need to add the script command for the test we want to debug on package.json
then we need to put a breakpoint where we want to start debugging, then we press shift+command+p and on the window that opens in visual studio we search for Debug: Debug npm Script and click on it, it will start the script on Debug mode.

## SEE TRACES FOR COMBINED API/UI TESTS
We need to set con playwright.conf.js **_traces option to on_** and once we run the test, we will have the trace.zip report result on test results folder, then we can open it on **_https://trace.playwright.dev/ _** and see all the information sent and received from our API requests, payloads, response, etc.

## Playwright configuration options for browser

{
      name: 'chromium',  **_Name of the browser to be used on tests_**
      use: { 
        ...devices['Desktop Chrome'], **_Browser that will be used, if we pass iphone 11 or any other mobile device it will open the test on that emulated device configuration and for this mobile devices we do not need to set viewport configuration, it will run on native mobile device screen resolution_**
        headless: false, **_If test will be run in headless mode or not_**
        screenshot: 'on', **_When on it takes screenshots at the end of each tess we have the option ( off and only-on-failure ) _**
        trace: 'on', **_This will keep log of every step executed for every test with before-after scresnshot evidence_** 
        viewport: { width:720, height: 720}, **_This indicates the resolution in which we want the broser to be open_**
        ignoreHTTPSErrors: true, **_It accepts the certification errors when present_**
        permissions: ['geolocation'], **_It allows geolocation when requested on the application_**
        video: 'retain-on-failure' **_This will save test execution when test fails, so if it fails we can see the video and get a better idea of why it failed_**
    },

## RETRY FLAKY TESTS
To run flaky tests we need to set this option and the number of retries we want to execute after test fails on the root configuration file, example below.

module.exports = defineConfig({
  testDir: './tests',
  retries: 1,


## DIFFERENT WAYS TO RUN TESTS
- npx playwright test
- npx playwright test --grep @MarkName **_This mark is written on test name example: test("@Smoke Testing Basic Functionallity", async ()=>{});   _**
- npx playwright test tests/InjectingStorageData.spec.js
- npx playwright test tests/InjectingStorageData.spec.js --config nameOfConfigFile.conf.js
- npx playwright test tests/InjectingStorageData.spec.js --config nameOfConfigFile.conf.js --project projectName

**_If we have many projects and we do not pass this argument when executing our tests it will run in all projects set on configuration file_**

## RUN TESTS PARALLELY
**_If we set workers option on the root configuration, we can set up how may parallel tests we want to run._**

**_This is to run individual tests in parallel_**
module.exports = defineConfig({
  testDir: './tests',
  retries: 1,
  workers: 5,

**_If we want to run tests cases in parallel within the same file we need to add this to the test at the top of all the tests, in example below it will run the 3 test cases in parallel_**
~~~
test.describe.configure({ mode: 'parrallel });
test("test1", ()=>{});
test("test2", ()=>{});
test("test3", ()=>{});
~~~

## REPORTS (PLAYWRIGHT DEFAULT REPORT)
This report can be found in playwright-report folder


## ALLURE REPORTS
first we need to install allure-report dependency with below command
***_sudo npm i -D @playwright/test allure-playwright --force_***
then we need to add below flag when executing the tests
--reporter=line,allure-playwright **_this does not have to have spaces between commands otherwise it throws error that module is not found and error make sure you have a main entry on package.json_**
Once execution is finished we need to execute below command to create/open allure report
allure generate ./allure-results && allure open ./allure-report **_where ./allure-results is the path to our report_**
EXAMPLE
allure generate ./allure-results --clean && allure open ./allure-report

