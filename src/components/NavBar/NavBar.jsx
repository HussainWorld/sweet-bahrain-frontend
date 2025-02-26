import { Link } from 'react-router'
import { useContext } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext'

const NavBar = () => {
	const { user, setUser } = useContext(UserContext);

	let isAdmin
	if (user) {
		const userType = user.userType;
		isAdmin = userType == 'admin'
	}

	const handleSignOut = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	return (
		<Navbar bg="light" variant="light" expand="lg" fixed="top" > {/* Fixed at top */}
			<Container>
				<Navbar.Brand as={Link} to="/">Sweet Bahrain</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						{user ? (
							<>

								{isAdmin ? (
									<>
										<Navbar.Text className="ms-3">
											Welcome, {user.username}
										</Navbar.Text>
										<Nav.Link as={Link} to="/create-product">Create Product</Nav.Link>
										<Nav.Link as={Link} to="/">Dashboard</Nav.Link>
										<Nav.Link as={Link} to="/" onClick={handleSignOut}>
											Sign Out
										</Nav.Link>
									</>
								) : (
									<>
										<Navbar.Text className="ms-3">
											Welcome, {user.username}
										</Navbar.Text>
										<Nav.Link as={Link} to="/">Dashboard</Nav.Link>
										<Nav.Link as={Link} to="/" onClick={handleSignOut}>
											Sign Out
										</Nav.Link>
									</>
								)}
							</>
						) : (
							<>
								<Nav.Link as={Link} to="/sign-up">Sign Up</Nav.Link>
								<Nav.Link as={Link} to="/sign-in">Sign In</Nav.Link>
								{/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavBar;