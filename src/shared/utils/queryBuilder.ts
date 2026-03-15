export class QueryBuilder {
  private query: any;
  private prismaQuery: any = {};

  constructor(query: any) {
    this.query = query;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    this.prismaQuery.skip = (page - 1) * limit;
    this.prismaQuery.take = limit;

    return this;
  }

  sort() {
    if (this.query.sortBy) {
      this.prismaQuery.orderBy = {
        [this.query.sortBy]: this.query.sortOrder || 'desc',
      };
    }

    return this;
  }

  search(fields: string[]) {
    if (this.query.search) {
      this.prismaQuery.where = {
        OR: fields.map((field) => ({
          [field]: {
            contains: this.query.search,
            mode: 'insensitive',
          },
        })),
      };
    }

    return this;
  }

  build() {
    return this.prismaQuery;
  }
}
