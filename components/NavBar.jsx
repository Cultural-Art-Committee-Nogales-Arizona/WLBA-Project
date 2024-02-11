'use  client'

import { useState, useEffect, useContext } from 'react'
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { useUser } from '@auth0/nextjs-auth0/client'
import WhiteLogo from '@/public/whiteLogo'
import CustomUserContext from './GlobalUserContext'; 

import styles from './NavBar.module.css'

import PageLink from './PageLink'
import AnchorLink from './AnchorLink'
import ChangeLanguage from './LanguageButton'

const NavBar = () => {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading } = useUser()
  const toggle = () => setIsOpen(!isOpen)
  
  const handleLogout = () => {
    // Perform any cleanup tasks here (e.g., clear localStorage)
    localStorage.removeItem('adminAuthId');
  }

  // Fetch custom user data when the component mounts
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    // console.log(user)
    try {

      if (user) {
          // console.log(globalUserData)
        let name = user.given_name ?? user.name

        const adminAuthId = localStorage.getItem('adminAuthId');
        const adminStatus = adminAuthId ? true : false

        // Example fetch function to get custom user data
        const fetchCustomUserData = async () => {
          // Perform your fetch to get custom user data
          const response = await fetch(`/api/user?name=${name}`, { signal, method: 'GET' })
          if (response.ok) {
            const responseData = await response.json()


            setGlobalUserData(prev => ({
              ...prev,
              ...responseData.data,
              admin: adminStatus,
              adminAuthId: adminAuthId
            }))
          }
        }

        fetchCustomUserData()
      }
    } catch (error) {
      console.error(error)
    }
    
  }, [user])
  
  return (
    <div className="nav-container" data-testid="navbar" >
      <Navbar className={styles.navbar}  expand="md">
        <a href="/">
          <WhiteLogo scale="75" />
        </a>
        <Container>
          <NavbarToggler onClick={toggle} data-testid="navbar-toggle"  /> 
          <Collapse isOpen={isOpen} navbar>
            <Nav className="m-auto" navbar data-testid="navbar-items">
              <NavItem>
                <PageLink href="/" className="nav-link" testId="navbar-home">
                  <span className={styles.link_animation}>Home</span>
                </PageLink>
              </NavItem>
              <NavItem>
                <PageLink href="/about-us" className="nav-link" testId="navbar-ssr">
                  <span className={styles.link_animation}>About Us</span>
                </PageLink>
              </NavItem>
              <NavItem>
                <PageLink href="/calendar" className="nav-link" testId="navbar-csr">
                  <span className={styles.link_animation}>Calendar</span>
                </PageLink>
              </NavItem>
              <NavItem>
                <PageLink href="/gallery" className="nav-link" testId="navbar-external">
                  <span className={styles.link_animation}>Gallery</span>
                </PageLink>
              </NavItem>
              <NavItem>
                <PageLink href="/volunteer" className="nav-link" testId="navbar-external">
                  <span className={styles.link_animation}>Volunteer</span>
                </PageLink>
              </NavItem>
              {/*  Add this as a donate button later */}
              {/* <NavItem>
                <PageLink href="/stripe" className="nav-link" testId="navbar-stripe">
                  Stripe Page
                </PageLink>
              </NavItem> */}
            </Nav>
            <Nav className="d-none d-md-block" navbar>
              {!isLoading && !user && (
                <NavItem id="qsLoginBtn">
                  <AnchorLink
                    href="/api/auth/login"
                    className={styles.login}
                    tabIndex={0}
                    testId="navbar-login-desktop">
                    <span className={styles.login}>Log in</span>
                  </AnchorLink>
                </NavItem>
              )}
              {user && (
                <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop">
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-desktop"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header data-testid="navbar-user-desktop">
                      {user.name}
                    </DropdownItem>
                    <DropdownItem className="dropdown-profile" tag="span">
                      <PageLink href="/dashboard" icon="user" testId="navbar-profile-desktop">
                        Dashboard
                      </PageLink>
                    </DropdownItem>
                    <DropdownItem id="qsLogoutBtn"  onClick={handleLogout}>
                      <AnchorLink href="/api/auth/logout" icon="power-off" testId="navbar-logout-desktop">
                        Log out
                      </AnchorLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isLoading && !user && (
              <Nav className="d-md-none" navbar>
                <AnchorLink
                  href="/api/auth/login"
                  className="btn btn-primary btn-block"
                  tabIndex={0}
                  testId="navbar-login-mobile">
                  <span className={styles.login}>Log in</span>
                </AnchorLink>
              </Nav>
            )}
            {user && (
              <Nav
                id="nav-mobile"
                className="d-md-none justify-content-between"
                navbar
                data-testid="navbar-menu-mobile">
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-mobile"
                    />
                    <h6 className="d-inline-block" data-testid="navbar-user-mobile">
                      {user.name}
                    </h6>
                  </span>
                </NavItem>
                <NavItem>
                  <PageLink href="/profile" icon="user" testId="navbar-profile-mobile">
                    Profile
                  </PageLink>
                </NavItem>
                <NavItem id="qsLogoutBtn">
                  <AnchorLink
                    href="/api/auth/logout"
                    className="btn btn-link p-0"
                    icon="power-off"
                    testId="navbar-logout-mobile">
                    Log out
                  </AnchorLink>
                </NavItem>
              </Nav>
            )}
            <ChangeLanguage />
          </Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
