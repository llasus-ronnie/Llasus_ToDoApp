import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/App.css";
import Header from "./components/Navbar.jsx";
import DeleteModal from "./components/DeleteModal.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [validated, setValidated] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || !dueDate) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (editIndex !== null) {
      const updatedTasks = tasks.map((t, index) =>
        index === editIndex
          ? { ...t, task, dueDate: dueDate.toISOString(), notes, priority }
          : t
      );
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([
        ...tasks,
        {
          task,
          dueDate: dueDate.toISOString(),
          notes,
          priority,
          completed: false,
        },
      ]);
    }

    // Reset fields
    setTask("");
    setDueDate(null);
    setNotes("");
    setPriority("");
    setValidated(false);
  };

  const handleEditTask = (index) => {
    console.log("Editing task at index:", index, tasks[index]);

    setTask(tasks[index].task);
    setNotes(tasks[index].notes || "");
    setPriority(tasks[index].priority || "");

    const parsedDate = tasks[index].dueDate
      ? new Date(tasks[index].dueDate)
      : null;
    setDueDate(
      parsedDate instanceof Date && !isNaN(parsedDate) ? parsedDate : null
    );

    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    console.log("Deleting task at index:", index);
    setTasks(tasks.filter((_, i) => i !== index));
    setShowDeleteModal(false);
  };

  const handleToggleComplete = (index) => {
    console.log("Toggling complete for task at index:", index);
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const handleShowDeleteModal = (index) => {
    setTaskToDelete(index);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const totalTasks = tasks.length;
  const completedProgress =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  const pendingProgress =
    totalTasks === 0 ? 0 : (pendingTasks / totalTasks) * 100;

  const filteredTasks = priorityFilter
    ? tasks.filter(
        (task) => !task.completed && task.priority === priorityFilter
      )
    : tasks.filter((task) => !task.completed);

  return (
    <>
      <Header />

      <Row>
        <Col md={6}>
          <div className="percentage-container">
            <h3>Progress</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                fontFamily: "Roboto Slab",
              }}
            >
              <div style={{ width: 120, height: 120 }}>
                <CircularProgressbar
                  value={pendingProgress}
                  text={`Pending: ${pendingProgress.toFixed(0)}%`}
                  styles={buildStyles({
                    textSize: "9px",
                    pathColor: `rgba(255, 193, 7, ${pendingProgress / 100})`,
                    textColor: "#000",
                  })}
                />
              </div>
              <div style={{ width: 120, height: 120, fontFamily: "Roboto Slab" }}>
                <CircularProgressbar
                  value={completedProgress}
                  text={`Completed: ${completedProgress.toFixed(0)}%`}
                  styles={buildStyles({
                    textSize: "9px",
                    pathColor: `rgba(40, 167, 69, ${completedProgress / 100})`,
                    textColor: "#000",
                  })}
                />
              </div>
            </div>

            <h3 style={{ marginTop: "1rem" }}>Completed</h3>
            {tasks.filter((task) => task.completed).length === 0 ? (
              <p>No completed tasks yet.</p>
            ) : (
              <ListGroup>
                {tasks
                  .filter((task) => task.completed)
                  .map((task, index) => {
                    const originalIndex = tasks.findIndex((t) => t === task);
                    return (
                      <ListGroup.Item key={originalIndex}>
                        <Row>
                          <Col>
                            <span
                              style={{
                                textDecoration: task.completed
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              <strong> {task.task} </strong>- Due:{" "}
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "No Due Date"}
                            </span>
                          </Col>
                          <Col className="d-flex justify-content-end">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleShowDeleteModal(originalIndex)
                              }
                              style={{ marginLeft: 10 }}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="task-container">
            <h3>Task</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
                  <Form.Group controlId="formTask">
                    <Form.Control
                      type="text"
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Enter task"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a task.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="formDueDate">
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      placeholderText="Enter due date"
                      className={`form-control ${
                        validated && !dueDate ? "is-invalid" : ""
                      }`}
                      required
                    />
                    {validated && !dueDate && (
                      <div className="invalid-feedback d-block">
                        Please select a due date.
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={8} style={{ marginTop: "10px" }}>
                  <Form.Group controlId="formNotes">
                    <Form.Control
                      as="textarea"
                      placeholder="Notes"
                      rows={1}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter some notes.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4} style={{ marginTop: "10px" }}>
                  <Form.Group controlId="formPriority">
                    <Form.Control
                      as="select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>
                        Select Priority
                      </option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select a priority level.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div
                className="d-flex justify-content-end"
                style={{ marginTop: 10 }}
              >
                <Button variant="warning" type="submit">
                  {editIndex !== null ? "Update Task" : "Add Task"}
                </Button>
              </div>
            </Form>

            <h3>Pending</h3>
            <div className="d-flex justify-content-start mb-3">
              <Button
                variant="outline-primary"
                onClick={() => setPriorityFilter("")}
                className="me-2"
              >
                All
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setPriorityFilter("High")}
                className="me-2"
              >
                High
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setPriorityFilter("Medium")}
                className="me-2"
              >
                Medium
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setPriorityFilter("Low")}
              >
                Low
              </Button>
            </div>
            {filteredTasks.length === 0 ? (
              <p>No pending task.</p>
            ) : (
              <ListGroup>
                {filteredTasks.map((task, i) => {
                  const originalIndex = tasks.findIndex((t) => t === task);
                  return (
                    <ListGroup.Item key={originalIndex}>
                      <Row>
                        <Col>
                          <Form.Check
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(originalIndex)}
                            label={
                              <span
                                style={{
                                  textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                <strong>{task.task}</strong>
                                <br />
                                <small>
                                  Due: {""}
                                  {task.dueDate
                                    ? new Date(
                                        task.dueDate
                                      ).toLocaleDateString()
                                    : "No Due Date"}{" "}
                                </small>
                                <br />
                                <small>Priority: {task.priority}</small>
                                <br />
                                <small>Notes: {task.notes}</small>
                              </span>
                            }
                          />
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditTask(originalIndex)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleShowDeleteModal(originalIndex)}
                            style={{ marginLeft: 10 }}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            )}
          </div>
        </Col>
      </Row>

      <DeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={() => handleDeleteTask(taskToDelete)}
      />
    </>
  );
}

export default App;
