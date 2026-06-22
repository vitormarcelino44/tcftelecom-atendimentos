public abstract class Material {

    public String titulo;
    private int codigo;

    public Material(String titulo, int codigo) {
        this.titulo = titulo;
        this.codigo = codigo;
    }

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public abstract void mostrarDados();
}
public class Livro extends Material {

    public String autor;

    public Livro(String titulo, int codigo, String autor) {
        super(titulo, codigo);
        this.autor = autor;
    }

    @Override
    public void mostrarDados() {
        System.out.println("Livro");
        System.out.println("Título: " + titulo);
        System.out.println("Código: " + getCodigo());
        System.out.println("Autor: " + autor);
        System.out.println("---------------------");
    }
}
public class Revista extends Material {

    public String editora;

    public Revista(String titulo, int codigo, String editora) {
        super(titulo, codigo);
        this.editora = editora;
    }

    @Override
    public void mostrarDados() {
        System.out.println("Revista");
        System.out.println("Título: " + titulo);
        System.out.println("Código: " + getCodigo());
        System.out.println("Editora: " + editora);
        System.out.println("---------------------");
    }
}