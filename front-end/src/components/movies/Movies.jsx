import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// import { notify } from "react-notify-toast";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

// import SweetAlert from "sweetalert-react";
import Icon from "@material-ui/core/Icon";

import MaterialTable from "material-table";
import { Link } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiTreeView from "material-ui-treeview";

// import CategoriaService from "../../services/categoria-service";

var categoria = [];
const useStyles = theme => ({
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
      categorias: [],
      openModal: false,
      categoria_descricao: "",
      campo_descricao_error: "",
      title: "",
      genres2: [
        {
          value: "Parent A",
          nodes: [{ value: "Child A" }, { value: "Child B" }]
        },
        {
          value: "Parent B",
          nodes: [
            {
              value: "Child C"
            },
            {
              value: "Parent C",
              nodes: [{ value: "Child D" }, { value: "Child E" }, { value: "Child F" }]
            }
          ]
        },
        {
          value: "Parent H"
        }
      ],
      genres: []
    };

    // [
    //   {
    //     value: "Parent A",
    //     nodes: [{ value: "Child A" }, { value: "Child B" }]
    //   },
    //   {
    //     value: "Parent B",
    //     nodes: [
    //       {
    //         value: "Child C"
    //       },
    //       {
    //         value: "Parent C",
    //         nodes: [{ value: "Child D" }, { value: "Child E" }, { value: "Child F" }]
    //       }
    //     ]
    //   }
    // ]

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleExcluirClick = this.handleExcluirClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  // Função recursiva para popular o tree
  populate(data, parentIndex) {
    // Verifica se o id do parente é igual ao pesquisado
    // E verifica se o id não é igual ao pesquisado (gera erro de loop infinito util.inspect())
    const children = data.filter(each => each.parentIndex === parentIndex && each.parentIndex !== each.index);
    children.forEach(child => {
      child.nodes = this.populate(data, child.id);
    });
    return children;
  }

  componentDidMount() {
    var titles = require("../../assets/data/titles.json");
    var a = require("../../assets/data/genres.json");

    let genres = [];

    for (let i = 0; i < a.length; i++) {
      a[i].value = a[i].genre;
    }

    let c = [];

    a.forEach(element => {
      // filtra os do começo da árvore
      if (element.parentIndex == -1 || element.parentIndex == element.index) {
        element.nodes = this.populate(a, element.index);
        c.push(element);
        return element;
      }
    });

    // for (let i = 0; i < a.length; i++) {}

    // for (let i = 0; i < a.length; i++) {
    //   let b = a.filter(x => x.parentIndex === a[i].index); // Procura em todos

    //   if (b.length > 0) {
    //     a[i].nodes = b;
    //     genres.push(a);
    //   }
    // }

    // for (let i = 0; i < a.length; i++) {
    //   if (a[i].parentIndex === -1) {
    //     let b = a.filter(x => x.parentIndex === a[i].index);
    //     console.log(a[i]);
    //     console.log(b);

    //     a[i].nodes = b;

    //     genres.push(a);
    //   }
    // }

    this.setState({ genres: c });

    // CategoriaService.getList(
    //   output => {
    //     this.setState({
    //       categorias: output
    //     });
    //   },
    //   () => {}
    // );
  }

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

  handleCloseModal = () => {
    this.setState({ openModal: false });
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

    if (tempData.categoria_id == undefined) {
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
    const { categorias, categoria_descricao, campo_descricao_error, title, genres } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper className="paper">
              <MuiTreeView tree={genres} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={8}>
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
                data={categorias.map(item => {
                  return {
                    title: item.title,
                    plot: item.plot,
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
                        <Link className="link" to={"/dashboard/subcategorias/" + item.categoria_id}>
                          <Button title={"Subcategorias"} className={"botao__primario"} variant="contained">
                            <Icon>list</Icon>
                          </Button>
                        </Link>
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
          onClose={this.handleCloseModal}
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
                        error={campo_descricao_error == "" ? false : true}
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