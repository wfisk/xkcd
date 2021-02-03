<script>
  import { createEventDispatcher, tick } from 'svelte';
  import Fa from 'svelte-fa';
  import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Progress,
  } from 'sveltestrap';

  import {
    format as dateFormat,
    formatISO as dateFormatISO,
    parseISO as dateParseISO,
    startOfWeek,
    endOfWeek,
    addWeeks,
  } from 'date-fns';

  import { draggable } from '/src/aspects/draggable';
  import DraggableModal from '/src/components/modals/DraggableModal.svelte';

  import { range } from '/src/lib/utils/range';
  import { simulationBuild } from '/src/lib/operations/simulationBuild';

  import scenarios from '/src/stores/scenarios';
  export let isOpen = false;

  const dispatch = createEventDispatcher();

  const simulationSizes = Array.from(range(1, 21)).map((it) => ({
    value: it,
    text: `${it * 4} teams (up to ${it * 4 * 6} participants)`,
  }));

  const defaultStartsOn = startOfWeek(addWeeks(new Date(), 1));
  const defaultFinishesOn = endOfWeek(addWeeks(new Date(), 1));
  const defaultStartsOnISO = dateFormatISO(defaultStartsOn, {
    representation: 'date',
  });
  const defaultFinishesOnISO = dateFormatISO(defaultFinishesOn, {
    representation: 'date',
  });
  const defaultTeamPassword = 'qwerty';

  let simulationBuilding = false;

  let form;
  let buildPercent = 0;

  let handleCancel = (event) => {
    isOpen = false;
    dispatch('close', { action: 'cancel' });
  };

  async function handleSubmit(event) {
    //const form = event.target;
    const formData = new FormData(form);
    const params = Object.fromEntries(formData.entries());

    params.startsOn = dateParseISO(params.startsOn);
    params.finishesOn = dateParseISO(params.finishesOn);
    params.simulationSize = parseInt(params.simulationSize, 10);

    simulationBuilding = true;
    handleCancel = false;
    tick();

    await simulationBuild({
      ...params,
      onProgress({ step, max }) {
        buildPercent = parseInt((step / max) * 100, 10);
      },
    });

    isOpen = false;
    dispatch('close', { action: 'create' });
  }
</script>

<DraggableModal
  {isOpen}
  toggle={handleCancel}
  class="mw-100 w-11-12"
  transitionOptions={{ duration: 120 }}
  backdrop={false}
  action={draggable}>
  <ModalHeader toggle={handleCancel}>
    <strong>New Simulation</strong>
  </ModalHeader>
  <ModalBody>
    {#if simulationBuilding}
      Building simulation ...
      <Progress color="info" value={buildPercent} />
    {:else}
      <form on:submit|preventDefault={handleSubmit} bind:this={form}>
        <div class="row">
          <div class="col-md-9">
            <div
              class="card border-light bg-white p-1"
              style="border-width: 0.25rem;">
              <div class="card bg-light border-0">
                <div class="card-body">
                  <!-- Name -->
                  <div class="form-group">
                    <label for="simulation-name">Simulation Name</label>
                    <input
                      class="form-control"
                      id="simulation-name"
                      name="simulationName"
                      aria-describedby="simulation-name-help"
                      required />
                    <small
                      id="simulation-name-help"
                      class="form-text text-muted">For example,
                      <em>Leadership in Crisis, November 2020</em>.</small>
                  </div>

                  <!-- Starts On and Finishes On -->
                  <div class="form-group row">
                    <div class="col-sm-6">
                      <label for="simulation-starts-on">Starts on</label>
                      <input
                        type="date"
                        class="form-control"
                        id="simulation-starts-on"
                        name="startsOn"
                        value={defaultStartsOnISO} />
                    </div>
                    <div class="col-sm-6">
                      <label for="simulation-ends-on">Finishes on</label>
                      <input
                        type="date"
                        class="form-control"
                        id="simulation-ends-on"
                        name="finishesOn"
                        value={defaultFinishesOnISO} />
                    </div>
                  </div>

                  <!-- Scenario -->
                  <div class="form-group">
                    <label for="simulation-scenario">Scenario</label>
                    <select
                      class="form-control"
                      id="simulation-scenario"
                      name="scenarioId">
                      {#each $scenarios as scenario}
                        <option value={scenario.id}>
                          {scenario.name}
                          (based on
                          {scenario.source}
                          {scenario.startYear}
                          to
                          {scenario.endYear})
                        </option>
                      {/each}
                    </select>
                  </div>

                  <!-- Teams -->
                  <div class="row">
                    <div class="offset-sm-1 col-sm-11">
                      <h5 class="border-bottom">
                        <Fa icon={faUserFriends} />
                        Teams
                      </h5>
                      <p>
                        Teams are created in mutliples of
                        <strong>four</strong>
                        representing the four sectors: durables, non-durables,
                        semi-durables and services.
                      </p>
                      <p>
                        As a guide below we assume a maximum of six participants
                        per team, so, for example, four teams would be
                        sufficient for
                        <strong>up to 24 participants</strong>. This, though, is
                        just a guide, and you may organise to have as many or as
                        few participants per team as you wish. The application
                        does not place any limits on the number of participants
                        per team.
                      </p>

                      <!-- Number of Teams -->
                      <div class="form-group">
                        <label for="simulation-size">Number of Teams</label>
                        <select
                          class="form-control"
                          id="simulation-size"
                          name="simulationSize">
                          {#each simulationSizes as simulationSize}
                            <option value={simulationSize.value}>
                              {simulationSize.text}
                            </option>
                          {/each}
                        </select>
                      </div>

                      <small
                        id="simulation-team-password-help"
                        class="form-text text-muted" />

                      <!-- Team Password -->
                      <div class="form-group">
                        <label for="simulation-team-password">Team Password</label>
                        <input
                          class="form-control"
                          id="simulation-team-password"
                          name="teamPassword"
                          aria-describedby="simulation-team-password-help"
                          value={defaultTeamPassword}
                          required />
                      </div>
                    </div>
                    <!-- /Teams -->
                  </div>

                  <!-- hr / -->

                  <!-- div class="form-group actions">
                    <button class="btn btn-primary">Submit</button>
                  </div -->
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <dl class="small">
              <dt>Simulation Name</dt>
              <dd>
                Userful things to include in the
                <em>Simulation Name</em>:

                <ul>
                  <li>Name of EDP programme or MBA course</li>
                  <li>Year and month (ex 2010-10)</li>
                  <li>Scenario selected</li>
                  <li>Campus</li>
                  <li>Class section</li>
                  <li>Your initials</li>
                </ul>
              </dd>
              <dt>Dates</dt>
              <dd>
                Participants will only be able to access the simulation within
                the period defined by
                <em>Starts on</em>
                and
                <em>Finishes on</em>
              </dd>
              <dt>Team Members</dt>
              <dd>
                Each member of the same team, will connect with the same
                username and password. After connecting, the application will
                prompt the participant to enter their name.
              </dd>
              <dt>Team Password</dt>
              <dd>
                <p>
                  All teams in the same simulation will be assigned the same
                  password. Please make a note of the password that you have set
                  for this simulation.
                </p>
                <p>
                  The simulation team password can be reset by archiving and
                  then restoring the simulation.
                </p>
                <p />
              </dd>
            </dl>
          </div>
        </div>
      </form>
    {/if}
  </ModalBody>
  <ModalFooter>
    {#if !simulationBuilding}
      <Button color="primary" on:click={handleSubmit}>Create Simulation</Button>
      <Button
        color="outline-secondary"
        disabled={!handleCancel}
        on:click={handleCancel}>
        Cancel
      </Button>
    {/if}
  </ModalFooter>
</DraggableModal>
