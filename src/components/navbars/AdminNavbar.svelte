<script>
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
  } from 'sveltestrap';

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  function handleReset(event) {
    console.log('reset');
  }
</script>

<Navbar color="danger" dark expand="md">
  <NavbarBrand href="/">Quiz</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ml-auto" navbar>
      <NavItem>
        <NavLink href="#components/">Components</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
      </NavItem>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>Options</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
          <DropdownItem divider />
          <DropdownItem on:click={handleReset}>Reset</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Nav>
  </Collapse>
</Navbar>

<style>
</style>
