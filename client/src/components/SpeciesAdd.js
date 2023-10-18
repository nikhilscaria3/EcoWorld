import React, { useState, useEffect } from 'react';
import "../styles/birdComponent.css"
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";


function SpeciesAddComponent() {
    const initialErrors = {
        description: { required: false },
        category: { required: false },
        species: { required: false },
        summary: { required: false },
        name: { required: false },
        custom_error: null,
    };
    const [errors, setErrors] = useState(initialErrors);
    const [users, setUsers] = useState([]); // Assuming users state is populated somehow
    const [message, setmessage] = useState("")
    const [filteredData, setfiltereddata] = useState([])
    const [Images, setImages] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [category, setCategory] = useState(localStorage.getItem('currentCategory') || "Bird");

    const [Inputs, setInputs] = useState({
        name: '',
        description: '',
        category: '',
        summary: '',
        species: '',

    });

    console.log(Inputs)
    const navigate = useNavigate()

    const totalPages = users ? Math.ceil(users.length / pageSize) : 0;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const datatodisplay = users ? users.slice(startIndex, endIndex) : [];


    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        setImages([...selectedFiles]);
    };


    useEffect(() => {
        // Save current category to localStorage whenever it changes
        localStorage.setItem('currentCategory', category);

        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/data?category=${category}`);
                console.log(response.data);
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [category]);

    const handleClick = (selectedCategory) => {
        setCategory(selectedCategory);
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({ ...prevData, [name]: value }));
    };



    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };


    const handleSearch = () => {
        const filteredUsers = users.filter((user) => {
            return user.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        setfiltereddata(filteredUsers);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();


        let formErrors = initialErrors;
        let hasError = false;

        if (Inputs.name === '') {
            formErrors.name.required = true;
            hasError = true;
        }
        if (Inputs.description === '' && Inputs.description.length < 20) {
            formErrors.description.required = true;
            hasError = true;
        }
        if (Inputs.summary === '') {
            formErrors.summary.required = true;
            hasError = true;
        }
        if (Inputs.species === '') {
            formErrors.species.required = true;
            hasError = true;
        }
        if (Inputs.category === "") {
            formErrors.category.required = true;
            hasError = true;
        }

        if (!hasError) {

            const formData = new FormData();

            // Append other form data to formData object
            formData.append('name', Inputs.name);
            formData.append('description', Inputs.description);
            formData.append('summary', Inputs.summary);
            formData.append('species', Inputs.species);
            formData.append('category', Inputs.category);

            // Append each selected file to the formData object
            for (let i = 0; i < Images.length; i++) {
                formData.append('file', Images[i]);
            }


            try {
                const response = await axios.post('/api/dataadd', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                // Handle success, e.g., show a success message to the user
                console.log('Bird data added:', response.data);
                setmessage(response.data.message)
            } catch (error) {
                // Handle error, e.g., show an error message to the user
                console.error('Error adding bird data:', error);
            }

            // Clear the form after submission
        }
        setErrors(formErrors);
    };


    useEffect(() => {
        if (message) {
            // Only set a timeout if the message is not empty
            const timer = setTimeout(() => {
                setmessage('');
            }, 5000);

            // Cleanup function to clear the timeout if the component unmounts or the message changes before 5 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);


    const handleSummary = (name, summary, species) => {
        // Navigate to the summary page with the provided name and summary
        navigate('/summary', {
            state: { name, summary, category, species }
        });
    };

    return (
        <div className='MainContainer'>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-light ">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <h1 className='navbrand'>EcoWorld</h1>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item me-auto mb-2 ml-3">
                                <form className="container-fluid justify-content-start">
                                    <button type="button" id="button" className="navbutton btn btn-outline-dark me-2" data-bs-toggle="modal"
                                        data-bs-target="#exampleModal">
                                        To Add
                                    </button>
                                    {category !== "Bird" ? <button
                                        type="button"
                                        id="birdButton"
                                        className={`navbutton btn btn-outline-dark me-2 ${category === 'Bird' ? '' : 'active'}`}
                                        onClick={() => handleClick('Bird')}
                                    >
                                        Bird
                                    </button> : null}

                                    <button
                                        type="button"
                                        id="animalButton"
                                        className={`navbutton btn btn-outline-dark me-2 ${category === 'Animal' ? '' : 'active'}`}
                                        onClick={() => handleClick('Animal')}
                                    >
                                        Animal
                                    </button>
                                </form>
                            </li>

                        </ul>

                        <div className='searchbar'>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleChange}
                            />
                            <button className="searchbutton" onClick={handleSearch}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* ... Navigation bar content ... */}
            </nav>

            {/* Modal for Adding Bird Species */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {/* ... Modal content ... */}
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Bird</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} >
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" onChange={handleInputChange} id="name" name="name" />
                                {errors.name.required ? (<span className="text-danger" >
                                    Name is required.
                                </span>) : null}

                                <label htmlFor="description" className="form-label">Description (Max 20 Words)</label>
                                <input type="text" className="form-control" id="description" onChange={handleInputChange} name="description" />
                                {errors.description.required ? (<span className="text-danger" >
                                    Description is required.
                                </span>) : null}

                                <label htmlhtmlFor="category" className="form-label">
                                    Category
                                </label>
                                <select
                                    className="form-select"
                                    id="category"
                                    name="category"
                                    value={Inputs.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Animal">Animal</option>
                                    <option value="Fish">Fish</option>
                                    <option value="Insect">Insect</option>
                                    <option value="Reptile">Reptile</option>
                                    <option value="Plant">Plant</option>
                                    <option value="Amphibian">Amphibian</option>

                                </select>
                                {errors.category.required ? (
                                    <span className="text-danger">Category is required.</span>
                                ) : null}


                                <label htmlFor="summary" className="form-label">Summary</label>
                                <textarea className="form-control" id="summary" name="summary" rows="3" onChange={handleInputChange} ></textarea>
                                {errors.summary.required ? (<span className="text-danger" >
                                    Summary is required.
                                </span>) : null}


                                <label htmlFor="image" className="form-label">Images</label>
                                <input type="file" name="photo" id="photo" onChange={handleFileChange} accept="image/*" multiple />

                                <label htmlFor="species" className="form-label">Known as</label>
                                <input type="text" className="form-control" id="species" name="species" onChange={handleInputChange} />
                                {errors.species.required ? (<span className="text-danger">
                                    Species is required.
                                </span>) : null}


                                <input type="submit" className="submit-button" value="Submit" />

                                {message && (
                                    <div className="message mt-2">
                                        <p>{message}</p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            <div className='categorydiv'>
                <h1 className='categoryHead'>Category : {category}</h1>
            </div>


            <div className="centered mt-5">
                {filteredData.length > 0 ? (
                    filteredData.map((user) => (
                        <div key={user._id} className="card border-left-behind">
                            <div className="shadow"></div>
                            <div className="imagebackground">
                                {user.photos.length > 0 && (
                                    <img className='image' src={user.photos[0].imageUrl} alt={`Image 1`} />
                                )}
                            </div>

                            <div className="image cutout"></div>
                            <div className="content">
                                <span>Name</span>
                                <h2>{user.name}</h2>
                                <span>Known as</span>
                                <h2>{user.species}</h2>
                                <p>{user.description}</p>
                                <button
                                    onClick={() => handleSummary(user.name, user.species, user.summary)}
                                >
                                    Summary
                                </button>
                            </div>
                        </div>
                    ))
                ) : (!datatodisplay.length || searchQuery) ? (
                    <div className="empty-state">
                        No courses found matching your search query.
                    </div>
                ) : (
                    datatodisplay.map((user) => (
                        <div key={user._id} className="card border-left-behind">
                            <div className="shadow"></div>
                            <div className="imagebackground">
                                {user.photos.length > 0 && (
                                    <img className='image' src={user.photos[0].imageUrl} alt={`Image 1`} />
                                )}
                            </div>

                            <div className="image cutout"></div>
                            <div className="content">
                                <span>Name</span>
                                <h2>{user.name}</h2>
                                <span>Known as</span>
                                <h2>{user.species}</h2>
                                <p>{user.description}</p>
                                <button
                                    onClick={() => handleSummary(user.name, user.species, user.summary)}
                                >
                                    Summary
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {!users.length && searchQuery && (
                    <div className="empty-state">
                        No courses found matching your search query.
                    </div>
                )}
            </div>

            <div className="pagination-container">
                <button className="previousbutton" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <span className="pagination-indicator">{`Page ${currentPage} of ${totalPages}`}</span>
                <button className="nextbutton" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

        </div>
    );
};

export default SpeciesAddComponent;
