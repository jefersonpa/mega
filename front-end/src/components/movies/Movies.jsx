import React, { Component } from "react";
import { Paper, Button, Grid, TextField, Icon, Dialog, DialogContent, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiTreeView from "material-ui-treeview";
import MaterialTable from "material-table";

// import { notify } from "react-notify-toast";
// import SweetAlert from "sweetalert-react";

// import CategoriaService from "../../services/categoria-service";

var categoria = [];
const useStyles = () => ({
  root: {
    flexGrow: 1,
    margin: 12
  }
});
class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      idToDelete: 0,
      openModal: false,
      categoria_descricao: "",
      campo_descricao_error: "",
      title: "",
      genres: [],
      titles: [],
      titles_selected: []
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleExcluirClick = this.handleExcluirClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  componentDidMount() {
    var titles = require("../../assets/data/titles.json");
    var all_genres = require("../../assets/data/genres.json");

    let genres = [];

    for (let i = 0; i < all_genres.length; i++) {
      all_genres[i].value = all_genres[i].genre;
    }

    all_genres.forEach(genre => {
      // filtra os do começo da árvore
      if (genre.parentIndex === -1 || genre.parentIndex === genre.index) {
        genre.nodes = this.populate(all_genres, genre.index);
        genres.push(genre);
      }
    });

    this.setState({ genres, titles });
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
      let titles_selected = this.state.titles.filter(title => title.genreIndex === data.index);
      this.setState({ titles_selected });
    } else {
      this.setState({ titles_selected: [] });
    }
  };

  handleClickOpen = id => () => {
    // if (id != 0) {
    //   this.setState({
    //     title: "Editar"
    //   });
    //   CategoriaService.getById(
    //     id,
    //     output => {
    //       categoria = output;
    //       this.setState({ categoria_descricao: categoria.categoria_descricao });
    //     },
    //     err => {
    //       notify.show(err, "error", 5000);
    //     }
    //   );
    // } else {
    //   categoria = [];
    //   this.setState({ categoria_descricao: "" });
    // }
    // this.setState({ openModal: true });
  };

  handleExcluirClick = categoria_id => () => {
    this.setState({
      show: true,
      idToDelete: categoria_id
    });
  };

  onDelete() {
    // CategoriaService.delete(
    //   this.state.idToDelete,
    //   () => {
    //     this.setState({
    //       categorias: this.state.categorias.filter(
    //         u => u.categoria_id !== this.state.idToDelete
    //       )
    //     });
    //     notify.show("Dado excluido com sucesso!", "success", 5000);
    //   },
    //   error => {
    //     notify.show(error, "error", 5000);
    //   }
    // );
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };
  onClickCancel = () => {
    this.setState({
      openModal: false
    });
  };

  onClick = () => {
    let has_error = false;
    let tempData = [];
    tempData.categoria_id = categoria.categoria_id;
    tempData.categoria_descricao = this.state.categoria_descricao;

    this.setState({
      campo_descricao_error: ""
    });

    if (this.state.categoria_descricao === "") {
      this.setState({
        campo_descricao_error: "Este campo é obrigatório!"
      });
      has_error = true;
    }

    if (has_error) {
      //   notify.show("Confira os dados informados!", "error", 5000);
      return;
    }

    if (tempData.categoria_id === undefined) {
      //   CategoriaService.save(
      //     tempData,
      //     res => {
      //       tempData.categoria_id = res.categoria_id;
      //       let tmp = this.state.categorias;
      //       tmp.push(tempData);
      //       this.setState({
      //         categorias: tmp
      //       });
      //       notify.show("Dados salvos com sucesso!", "success", 5000);
      //       this.onClickCancel();
      //     },
      //     err => {
      //       notify.show(err, "error", 5000);
      //     }
      //   );
    } else {
      //   CategoriaService.update(
      //     tempData,
      //     () => {
      //       let tmp = this.state.categorias;
      //       for (let i = 0; i < tmp.length; i++) {
      //         if (tmp[i].categoria_id == tempData.categoria_id) {
      //           tmp[i] = tempData;
      //         }
      //       }
      //       this.setState({
      //         categorias: tmp
      //       });
      //       notify.show("Dados atualizados com sucesso!", "success", 5000);
      //       this.onClickCancel();
      //     },
      //     err => {
      //       notify.show(err, "error", 5000);
      //     }
      //   );
    }
  };

  render() {
    const { categoria_descricao, campo_descricao_error, genres, titles_selected } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Paper className="paper">
              <MuiTreeView tree={genres} style={{ padding: 0 }} onLeafClick={data => this.loadMovies(data)} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={8} md={9}>
            <Paper className="paper">
              <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                <Button variant="contained" type="button" className="botao-adicionar" onClick={this.handleClickOpen(0)}>
                  Adicionar
                </Button>
              </Grid>

              <br />
              <MaterialTable
                options={{
                  pageSize: 10,
                  pageSizeOptions: [10, 20, 30]
                }}
                localization={{
                  pagination: {
                    labelDisplayedRows: "{from}-{to} de {count}", // {from}-{to} of {count}
                    labelRowsPerPage: "Registros por página:", // Rows per page:
                    firstAriaLabel: "Primeira Página", // First Page
                    firstTooltip: "Primeira página", // First Page
                    previousAriaLabel: "Página Anterior", // Previous Page
                    previousTooltip: "Página Anterior", // Previous Page
                    nextAriaLabel: "Próxima Página", // Next Page
                    nextTooltip: "Próxima Página", // Next Page
                    lastAriaLabel: "Última Página", // Last Page
                    lastTooltip: "Última Página" // Last Page
                  },
                  toolbar: {
                    searchTooltip: "Pesquisar" // Search
                  },
                  header: {
                    actions: "Ações" // Actions
                  },
                  body: {
                    emptyDataSourceMessage: "Nenhum registro disponível" // No records to display
                  }
                }}
                columns={[
                  {
                    title: "Title",
                    field: "title",
                    headerStyle: { fontSize: 16 },
                    cellStyle: { fontSize: "16px" }
                  },
                  {
                    title: "Plot",
                    field: "plot",
                    headerStyle: { fontSize: 16 },
                    cellStyle: { fontSize: "16px" }
                  },
                  {
                    title: "Year",
                    field: "year",
                    headerStyle: { fontSize: 16 },
                    cellStyle: { fontSize: "16px" }
                  },
                  {
                    title: "Actions",
                    field: "actions",
                    headerStyle: { fontSize: 16 },
                    cellStyle: { fontSize: "16px" }
                  }
                ]}
                data={titles_selected.map(item => {
                  return {
                    title: item.title,
                    plot: (
                      <Tooltip title={item.plot} aria-label="Plot">
                        <div>{item.plot.length > 30 ? item.plot.substring(0, 30) + "..." : item.plot}</div>
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
                          onClick={this.handleClickOpen(item.categoria_id)}
                        >
                          <Icon>edit</Icon>
                        </Button>

                        <Button
                          title={"Deletar"}
                          className={"botao__excluir"}
                          variant="contained"
                          onClick={this.handleExcluirClick(item.categoria_id)}
                        >
                          <Icon>delete</Icon>
                        </Button>
                      </>
                    )
                  };
                })}
                title="MOVIES"
              />
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={this.state.openModal}
          onClose={() => this.setState({ openModal: false })}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
          maxWidth="md"
          className="dialogClass"
        >
          <DialogContent>
            <Grid container spacing={16} direction="row">
              <Grid item xs={12}>
                <Paper className="paper">
                  <Grid item xs={12}>
                    <h1>Categoria</h1>
                  </Grid>
                  <Grid container spacing={16} direction={"row"}>
                    <Grid item xs={12}>
                      <TextField
                        id="outlined-descricao"
                        label="Descrição"
                        className="textField"
                        margin="normal"
                        variant="outlined"
                        value={categoria_descricao}
                        helperText={campo_descricao_error}
                        error={campo_descricao_error === "" ? false : true}
                        required={true}
                        name="categoria_descricao"
                        onChange={event => {
                          this.handleChange("categoria_descricao", event.target.value);
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
                          onClick={this.onClick}
                        >
                          <i className="material-icons">done</i> Salvar
                        </Button>
                        <Button
                          title="Cancelar"
                          color="primary"
                          type="button"
                          variant="contained"
                          className={"botao__cancelar"}
                          onClick={this.onClickCancel}
                        >
                          <i className="material-icons">exit_to_app</i> Cancelar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        {/* <SweetAlert
          show={this.state.show}
          title="Excluir"
          html
          showCancelButton={true}
          type={"error"}
          text={"Você tem certeza que deseja excluir este registro?"}
          onConfirm={() => {
            this.setState({ show: false });
            this.onDelete();
          }}
          onCancel={() => this.setState({ show: false })}
        /> */}
      </div>
    );
  }
}

export default withStyles(useStyles)(Movies);
