import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper, Button, Grid, TextField, Icon, Dialog, DialogContent, Tooltip, Slide } from "@material-ui/core";
import MuiTreeView from "material-ui-treeview";
import MaterialTable from "material-table";
import SweetAlert from "sweetalert-react";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import { TABLE_PT, STORAGE_GENRES_DATA, STORAGE_TITLES_DATA } from "../../shared/environment.js";
import MoviesService from "../../services/movies-services";

const styles = () => ({
  selected: {
    borderTop: "1px solid #ddd",
    height: 50
  },
  focusVisible: {},
  gutters: {}
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genres: [],
      all_titles: [],
      titles_selected: [],
      genre_selected: null,
      title_selected: {},
      show_swal: false,
      open_modal: false,
      index: 0,
      title: "",
      title_error: "",
      plot: "",
      plot_error: "",
      year: 0,
      year_error: ""
    };

    this.notificationDOMRef = React.createRef();
  }

  componentDidMount() {
    var all_genres = this.loadData(STORAGE_GENRES_DATA); // Carrega os gêneros
    var all_titles = this.loadData(STORAGE_TITLES_DATA); // Carrega os títulos
    let genres = this.loadTree(all_genres); // Carrega os dados com o formato do material-ui-treeview
    this.setState({ genres, all_titles });
  }

  loadData(item_name) {
    // Carrega da storage
    var data = MoviesService.getStorageData(item_name);
    // Se não houver dados salvos, pega do arquivo json e salva na storage
    if (data == null) {
      data = item_name === STORAGE_GENRES_DATA ? require("../../assets/data/genres.json") : require("../../assets/data/titles.json");
      MoviesService.setStorageData(data, item_name);
    }
    return data;
  }

  loadTree(all_genres) {
    let genres = [];

    for (let i = 0; i < all_genres.length; i++) {
      // Cria o campo value, necessário no treeview
      all_genres[i].value = all_genres[i].genre;
    }

    all_genres.forEach(genre => {
      // filtra apenas os do começo da árvore
      if (genre.parentIndex === -1 || genre.parentIndex === genre.index) {
        genre.nodes = this.populate(all_genres, genre.index);
        genres.push(genre);
      }
    });
    return genres;
  }

  // Função recursiva para popular o tree
  populate(all_genres, parentIndex) {
    // Verifica se o id do parente é igual ao pesquisado
    // E verifica se o id não é igual ao pesquisado (gera erro de loop infinito util.inspect())
    const children = all_genres.filter(genre => genre.parentIndex === parentIndex && genre.parentIndex !== genre.index);
    children.forEach(child => {
      child.nodes = this.populate(all_genres, child.index);
    });
    return children;
  }

  loadMovies = data => {
    if (data.hasMovie) {
      let titles_selected = this.state.all_titles.filter(title => title.genreIndex === data.index);
      this.setState({ titles_selected, genre_selected: data });
    } else {
      this.setState({ titles_selected: [], genre_selected: null });
    }
  };

  handleClickOpenModal = item => {
    if (item !== null) {
      // Editar
      this.setState({
        open_modal: true,
        index: item.index,
        genreIndex: item.genreIndex,
        title: item.title,
        plot: item.plot,
        year: item.year,
        title_error: "",
        plot_error: "",
        year_error: ""
      });
    } else {
      // Adicionar
      this.setState({
        open_modal: true,
        index: 0,
        genreIndex: this.state.genre_selected.index,
        title: "",
        plot: "",
        year: 0,
        title_error: "",
        plot_error: "",
        year_error: ""
      });
    }
  };

  onDelete() {
    const { index, all_titles, genre_selected } = this.state;

    // Todos os titulos menos o deletado
    let new_titles = all_titles.filter(titles => titles.index !== index);
    this.setState({ all_titles: new_titles });

    this.loadMovies(genre_selected); // Atualiza o state dos filmes selecionados
    MoviesService.setStorageData(new_titles, STORAGE_TITLES_DATA); // Atualiza a storage
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  onSave = () => {
    let has_error = false;
    let data = {};
    data.index = this.state.index;
    data.genreIndex = this.state.genreIndex;
    data.title = this.state.title;
    data.plot = this.state.plot;
    data.year = this.state.year;

    this.setState({
      title_error: "",
      plot_error: "",
      year_error: ""
    });

    if (data.title === "") {
      this.setState({
        title_error: "Este campo é obrigatório!"
      });
      has_error = true;
    }

    if (data.plot === "") {
      this.setState({
        plot_error: "Este campo é obrigatório!"
      });
      has_error = true;
    }

    if (data.year === 0) {
      this.setState({
        year_error: "Este campo é obrigatório!"
      });
      has_error = true;
    }

    let today = new Date();

    if (data.year < 1800 || data.year > today.getFullYear()) {
      this.setState({
        year_error: "O ano do livro deve estar entre 1800 e " + today.getFullYear() + "!"
      });
      has_error = true;
    }

    if (has_error) {
      this.notificationDOMRef.current.addNotification({
        title: "Erro",
        message: "Confira os dados informados!",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 },
        dismissable: { click: true }
      });
      return;
    }

    let tmp = this.state.all_titles;
    if (data.index === 0) {
      let max_id = Math.max(...tmp.map(x => x.index)) + 1; // Pega o maior id + 1
      data.index = max_id;
      tmp.push(data);
    } else {
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].index === data.index) {
          tmp[i] = data;
          break;
        }
      }
    }

    this.setState({ all_titles: tmp, open_modal: false });
    this.loadMovies(this.state.genre_selected); // Atualiza o state dos filmes selecionados
    MoviesService.setStorageData(tmp, STORAGE_TITLES_DATA); // Atualiza a storage
    this.notificationDOMRef.current.addNotification({
      title: "Sucesso!",
      message: "Dados salvos com sucesso!",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  };

  render() {
    const { title, title_error, plot, plot_error, year, year_error, genre_selected, titles_selected, genres } = this.state;
    const { classes } = this.props;

    const dialog = () => {
      return (
        <Dialog
          open={this.state.open_modal}
          TransitionComponent={Transition}
          onClose={() => this.setState({ open_modal: false })}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
          maxWidth="md"
          className="dialogClass"
        >
          <DialogContent style={{ padding: 16 }}>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Paper className="paper">
                  <Grid item xs={12}>
                    <h1>Movie</h1>
                  </Grid>
                  <Grid container direction={"row"}>
                    <Grid item xs={12}>
                      <TextField
                        id="outlined-title"
                        label="Title"
                        className="textField"
                        margin="normal"
                        variant="outlined"
                        value={title}
                        helperText={title_error}
                        error={title_error === "" ? false : true}
                        required={true}
                        name="title"
                        onChange={event => {
                          this.handleChange("title", event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="outlined-plot"
                        label="Plot"
                        multiline
                        rows="4"
                        className="textField"
                        margin="normal"
                        variant="outlined"
                        value={plot}
                        helperText={plot_error}
                        error={plot_error === "" ? false : true}
                        required={true}
                        name="plot"
                        onChange={event => {
                          this.handleChange("plot", event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="outlined-year"
                        label="Year"
                        className="textField"
                        margin="normal"
                        variant="outlined"
                        value={year}
                        helperText={year_error}
                        error={year_error === "" ? false : true}
                        required={true}
                        name="year"
                        onChange={event => {
                          this.handleChange("year", event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container alignContent="flex-start" justify="flex-start" alignItems="flex-start">
                        <Button
                          title="Salvar"
                          color="primary"
                          type="button"
                          variant="contained"
                          className={"botao__salvar"}
                          onClick={this.onSave}
                        >
                          <Icon>done</Icon> Salvar
                        </Button>
                        <Button
                          title="Cancelar"
                          color="primary"
                          type="button"
                          variant="contained"
                          className={"botao__cancelar"}
                          onClick={() =>
                            this.setState({
                              open_modal: false
                            })
                          }
                        >
                          <Icon>exit_to_app</Icon> Cancelar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      );
    };

    const sweetAlert = () => {
      return (
        <SweetAlert
          show={this.state.show_swal}
          title="Excluir"
          showCancelButton={true}
          cancelButtonText="Cancelar"
          type="error"
          text="Você tem certeza que deseja excluir este registro?"
          onConfirm={() => {
            this.setState({ show_swal: false });
            this.onDelete();
          }}
          onCancel={() => this.setState({ show_swal: false })}
        />
      );
    };

    const materialTable = () => {
      return (
        <MaterialTable
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 20, 30]
          }}
          localization={TABLE_PT}
          columns={[
            {
              title: "Title",
              field: "title",
              headerStyle: { fontSize: 16 },
              cellStyle: { fontSize: 16 }
            },
            {
              title: "Plot",
              field: "plot",
              headerStyle: { fontSize: 16 },
              cellStyle: { fontSize: 16 }
            },
            {
              title: "Year",
              field: "year",
              headerStyle: { fontSize: 16 },
              cellStyle: { fontSize: 16 }
            },
            {
              title: "Actions",
              field: "actions",
              headerStyle: { fontSize: 16, minWidth: 135 },
              cellStyle: { fontSize: 16, minWidth: 135 }
            }
          ]}
          data={titles_selected.map(item => {
            return {
              title: item.title,
              plot: (
                <Tooltip title={item.plot} aria-label="Plot">
                  <div className="tableEllipsis">{item.plot}</div>
                </Tooltip>
              ),
              year: item.year,
              actions: (
                <>
                  <Button
                    variant="contained"
                    type="button"
                    title={"Editar"}
                    className={"botao__editar"}
                    onClick={() => this.handleClickOpenModal(item)}
                  >
                    <Icon>edit</Icon>
                  </Button>

                  <Button
                    title={"Deletar"}
                    className={"botao__excluir"}
                    variant="contained"
                    onClick={() =>
                      this.setState({
                        show_swal: true,
                        index: item.index
                      })
                    }
                  >
                    <Icon>delete</Icon>
                  </Button>
                </>
              )
            };
          })}
          title={genre_selected ? "MOVIES - " + genre_selected.genre.toUpperCase() : "MOVIES"}
        />
      );
    };

    return (
      <div className="root">
        <ReactNotification ref={this.notificationDOMRef} />
        {dialog()}
        {sweetAlert()}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Paper className="paper">
              <MuiTreeView
                listItemProps={{ className: classes.selected }}
                tree={genres}
                style={{ padding: 0 }}
                onLeafClick={data => this.loadMovies(data)}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={8} md={9}>
            <Paper className="paper">
              {genre_selected ? (
                <>
                  <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                    <Button variant="contained" type="button" className="botao__adicionar" onClick={() => this.handleClickOpenModal(null)}>
                      Adicionar
                    </Button>
                  </Grid>
                  <br />
                </>
              ) : (
                <></>
              )}
              {materialTable()}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Movies);
