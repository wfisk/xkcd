<script>
  import { map } from 'rxjs/operators';
  import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  import '/src/lib/file-saver/src/FileSaver';
  import 'save-svg-as-png';
  import ExcelJS from 'exceljs';

  import currentUser from '/src/stores/currentUser';
  import Quiz from '/src/models/Quiz';

  let modalIsOpen = false;
  let mediaType;
  let newQuizId;
  let newQuizName;
  let quizzes = Quiz.listenAll({ order: 'name' });

  function handleAddQuizCancel() {
    modalIsOpen = false;
  }

  async function handleAddQuizConfirm() {
    Quiz.add({
      id: newQuizId,
      name: newQuizName,
      owner: {
        uid: $currentUser.uid,
        displayName: $currentUser.displayName
      }
    });
    modalIsOpen = false;
  }

  async function handleDownloadFileClick(event) {
    // var blob = new Blob(["Hello, world!"], {
    //   type: "text/plain;charset=utf-8"
    // });
    // saveAs(blob, "hello world.txt");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('blort');

    sheet.getCell('A1').value = 'Hello, Moon!';
    sheet.getCell('A2').value = 77;

    let svg = document.getElementById('svg');

    let uri = await saveSvgAsPng.svgAsPngUri(svg, {
      scale: 10
    });

    const imageId2 = workbook.addImage({
      base64: uri,
      extension: 'png'
    });
    sheet.addImage(imageId2, {
      tl: {
        col: 2,
        row: 2
      },
      ext: {
        width: 240,
        height: 240
      }
    });

    let buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    });
    saveAs(blob, 'tests.xlsx');
  }
</script>

<template>
  <h1>Quizzes</h1>

  <table class="table table-striped">
    <thead>
      <th class="quiz-name">Name</th>
      <th class="quiz-id">Quiz Id</th>
      <th class="quiz-owner">Owner</th>
      <th class="quiz-active-question">Active Question</th>
    </thead>
    <tbody>
      {#each $quizzes as quiz}
        <tr>
          <td class="quiz-name">
            <a href="#/admin/quizzes/{quiz.id}">{quiz.name}</a>
          </td>
          <td class="quiz-id">{quiz.id}</td>
          <td class="quiz-owner">{quiz.owner && quiz.owner.displayName}</td>
          <td class="quiz-active-question">{quiz.activeQuestion}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <Button color="success" on:click={() => (modalIsOpen = true)}>
    Add Quiz
  </Button>

  <Button color="secondary" on:click={handleDownloadFileClick}>
    Download File
  </Button>

  <svg
    id="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24px"
    height="24px"
    role="img"
    class="grommetux-control-icon grommetux-control-icon-workshop
      grommetux-control-icon--huge grommetux-control-icon--responsive"
    aria-label="workshop">
    <path
      fill="none"
      stroke="#000"
      stroke-width="2"
      d="M19,7 C19,7 14,14 6.5,14 C4.5,14 1,15 1,19 L1,23 L12,23 L12,19 C12,16.5 15,18 19,11 L17.5,9.5 M3,5 L3,2 L23,2 L23,16 L20,16 M11,1 L15,1 L15,3 L11,3 L11,1 Z M6.5,14 C8.43299662,14 10,12.4329966 10,10.5 C10,8.56700338 8.43299662,7 6.5,7 C4.56700338,7 3,8.56700338 3,10.5 C3,12.4329966 4.56700338,14 6.5,14 Z" />
  </svg>

  <Modal isOpen={modalIsOpen}>
    <ModalHeader toggle={handleAddQuizCancel}>Add Quiz</ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label for="quiz-id">Quiz Id</label>
        <input class="form-control" id="quiz-id" bind:value={newQuizId} />
      </div>
      <div class="form-group">
        <label for="quiz-name">Name</label>
        <input class="form-control" id="quiz-name" bind:value={newQuizName} />
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={handleAddQuizConfirm}>OK</Button>
      <Button color="secondary" on:click={handleAddQuizCancel}>Cancel</Button>
    </ModalFooter>
  </Modal>
</template>

<style>
  .quiz-name {
    width: 25%;
  }

  .quiz-id {
    width: 33.333%;
  }

  .quiz-owner {
    width: 25%;
  }

  .quiz-active-question {
    width: 16.667%;
  }
</style>
